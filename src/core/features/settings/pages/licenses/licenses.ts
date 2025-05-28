// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnInit } from '@angular/core';
import { CoreConstants } from '@/core/constants';
import { Http } from '@singletons';
import { IonSearchbar } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CoreSharedModule } from '@/core/shared.module';
import { CoreEditorService } from '@features/editor/services/editor';

/**
 * Defines license info
 */
export interface CoreSettingsLicense {
    name: string;
    version: string;
    licenses: string | string[];
    repository?: string;
    publisher?: string;
    url?: string;
    email?: string;
    licenseUrl?: string;
    licenseFile?: string;
}

/**
 * Page that displays the open source licenses information.
 */
@Component({
    selector: 'page-core-app-settings-licenses',
    templateUrl: 'licenses.html',
    standalone: true,
    imports: [
        CoreSharedModule,
    ],
})
export default class CoreSettingsLicensesPage implements OnInit {

    protected static readonly LICENSES_PER_PAGE = 50;

    licensesUrl: string;
    loaded = false;
    licenses: CoreSettingsLicense[] = [];
    error = false;
    textFilter = '';
    appLicenseVersion: string;

    protected allLicenses: CoreSettingsLicense[] = [];
    protected filteredLicenses: CoreSettingsLicense[] = [];

    constructor() {
        this.appLicenseVersion = CoreConstants.BUILD.isDevelopment
            ? 'main'
            : `v${CoreConstants.CONFIG.versionname}`;

        this.licensesUrl = `https://raw.githubusercontent.com/moodlehq/moodleapp/${this.appLicenseVersion}/licenses.json`;
    }

    /**
     * @inheritdoc
     */
    async ngOnInit(): Promise<void> {
        try {
            const licenses = await firstValueFrom(Http.get(this.licensesUrl));
            this.allLicenses = Object.keys(licenses).map((name) => {
                const license = licenses[name];

                const nameSplit = name.lastIndexOf('@');
                license.name = name.substring(0, nameSplit);
                license.version = name.substring(nameSplit + 1);
                if (Array.isArray(license.licenses)) {
                    license.licenses = license.licenses.join(', ');
                }

                if (license.repository) {
                    license.repository = license.repository.replace('git://', 'https://');
                    if (license.repository.indexOf('github.com') > 0) {
                        const version = license.name == 'moodlemobile' ? this.appLicenseVersion : license.version;
                        license.licenseUrl = `${license.repository}/blob/${version}/${license.licenseFile}`;
                    }
                }

                return license;
            });

            this.allLicenses.push(...await CoreEditorService.getLicenseInformation());

            this.allLicenses.sort((a, b) => a.name.localeCompare(b.name));
            this.filterLicenses();

            this.error = false;
        } catch {
            this.error = true;
        }

        this.loaded = true;
    }

    /**
     * Filter licenses using filter text.
     */
    filterLicenses(): void {
        const filter = this.textFilter.trim().toLowerCase();

        if (filter == '') {
            this.filteredLicenses = this.allLicenses;
        } else {
            this.filteredLicenses = this.allLicenses.filter((license) => license.name.toLowerCase().indexOf(filter) >=0 ||
                license.version.toLowerCase().indexOf(filter) >=0 ||
                typeof license.licenses == 'string' && license.licenses.toLowerCase().indexOf(filter) >=0 ||
                license.repository && license.repository.toLowerCase().indexOf(filter) >=0 ||
                license.publisher && license.publisher.toLowerCase().indexOf(filter) >=0 ||
                license.url && license.url.toLowerCase().indexOf(filter) >=0 ||
                license.email && license.email.toLowerCase().indexOf(filter) >=0);
        }

        this.licenses = this.filteredLicenses.slice(0, CoreSettingsLicensesPage.LICENSES_PER_PAGE);
    }

    /**
     * Text filter changed.
     *
     * @param target Searchbar element.
     */
    filterChanged(target: IonSearchbar): void {
        this.textFilter = target.value || '';

        this.filterLicenses();
    }

    get canLoadMore(): boolean {
        return this.licenses.length < this.filteredLicenses.length;
    }

    /**
     * Load more licenses.
     *
     * @param infiniteComplete Infinite scroll complete function. Only used from core-infinite-loading.
     * @returns Resolved when done.
     */
    async loadMore(infiniteComplete?: () => void): Promise<void> {
        const start = this.licenses.length;
        const end = start + CoreSettingsLicensesPage.LICENSES_PER_PAGE;
        this.licenses.push(...this.filteredLicenses.slice(start, end));

        infiniteComplete?.();
    }

}
