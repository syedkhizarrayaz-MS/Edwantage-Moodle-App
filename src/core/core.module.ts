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

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationInitStatus, Injector, NgModule, Type } from '@angular/core';

import { CoreApplicationInitStatus } from './classes/application-init-status';
import { CoreFeaturesModule } from './features/features.module';
import { CoreInterceptor } from './classes/interceptor';
import { getDatabaseProviders } from './services/database';
import { getInitializerProviders } from './initializers';

/**
 * Get core services.
 *
 * @returns Core services.
 */
export async function getCoreServices(): Promise<Type<unknown>[]> {

    const { CoreAppProvider } = await import('@services/app');
    const { CoreAppDBService } = await import('@services/app-db');
    const { CoreConfigProvider } = await import('@services/config');
    const { CoreCronDelegateService } = await import('@services/cron');
    const { CoreCustomURLSchemesProvider } = await import('@services/urlschemes');
    const { CoreDbProvider } = await import('@services/db');
    const { CoreErrorHelperService } = await import('@services/error-helper');
    const { CoreFileHelperProvider } = await import('@services/file-helper');
    const { CoreFilepoolProvider } = await import('@services/filepool');
    const { CoreFileProvider } = await import('@services/file');
    const { CoreFileSessionProvider } = await import('@services/file-session');
    const { CoreGroupsProvider } = await import('@services/groups');
    const { CoreLangProvider } = await import('@services/lang');
    const { CoreLocalNotificationsProvider } = await import('@services/local-notifications');
    const { CoreNavigatorService } = await import('@services/navigator');
    const { CorePluginFileDelegateService } = await import('@services/plugin-file-delegate');
    const { CoreScreenService } = await import('@services/screen');
    const { CoreSitesProvider } = await import('@services/sites');
    const { CoreSyncProvider } = await import('@services/sync');
    const { CoreUpdateManagerProvider } = await import('@services/update-manager');
    const { CoreWSProvider } = await import('@services/ws');
    const { CorePlatformService } = await import('@services/platform');
    const { CoreQRScanService } = await import('@services/qrscan');

    const { CoreAlertsService } = await import('@services/overlays/alerts');
    const { CoreLoadingsService } = await import('@services/overlays/loadings');
    const { CorePopoversService } = await import('@services/overlays/popovers');
    const { CorePromptsService } = await import('@services/overlays/prompts');
    const { CoreToastsService } = await import('@services/overlays/toasts');

    // eslint-disable-next-line deprecation/deprecation
    const { CoreDomUtilsProvider } = await import('@services/utils/dom');
    // eslint-disable-next-line deprecation/deprecation
    const { CoreGeolocationProvider } = await import('@services/geolocation');
    // eslint-disable-next-line deprecation/deprecation
    const { CoreTextUtilsProvider } = await import('@services/utils/text');
    // eslint-disable-next-line deprecation/deprecation
    const { CoreTimeUtilsProvider } = await import('@services/utils/time');
    // eslint-disable-next-line deprecation/deprecation
    const { CoreUrlUtilsProvider } = await import('@services/utils/url');
    // eslint-disable-next-line deprecation/deprecation
    const { CoreUtilsProvider } = await import('@services/utils/utils');
    // eslint-disable-next-line deprecation/deprecation
    const { CoreMimetypeUtilsProvider } = await import('@services/utils/mimetype');
    // eslint-disable-next-line deprecation/deprecation
    const { CoreIframeUtilsProvider } = await import('@services/utils/iframe');

    return [
        CoreAppProvider,
        CoreAppDBService,
        CoreConfigProvider,
        CoreCronDelegateService,
        CoreCustomURLSchemesProvider,
        CoreDbProvider,
        CoreDomUtilsProvider,
        CoreErrorHelperService,
        CoreFileHelperProvider,
        CoreFilepoolProvider,
        CoreFileProvider,
        CoreFileSessionProvider,
        CoreGeolocationProvider,
        CoreGroupsProvider,
        CoreIframeUtilsProvider,
        CoreLangProvider,
        CoreLocalNotificationsProvider,
        CoreMimetypeUtilsProvider,
        CoreNavigatorService,
        CorePluginFileDelegateService,
        CorePlatformService,
        CoreQRScanService,
        CoreScreenService,
        CoreSitesProvider,
        CoreSyncProvider,
        CoreTextUtilsProvider,
        CoreTimeUtilsProvider,
        CoreUpdateManagerProvider,
        CoreUrlUtilsProvider,
        CoreUtilsProvider,
        CoreWSProvider,
        CoreAlertsService,
        CoreLoadingsService,
        CorePopoversService,
        CorePromptsService,
        CoreToastsService,
    ];
}

/**
 * Get core exported objects.
 *
 * @returns Core exported objects.
 */
export async function getCoreExportedObjects(): Promise<Record<string, unknown>> {
    const {
        CoreConstants,
        CoreCacheUpdateFrequency,
        DownloadStatus,
        MINIMUM_MOODLE_VERSION,
        MOODLE_RELEASES,
    } = await import('@/core/constants');

    /* eslint-disable @typescript-eslint/naming-convention */
    return {
        CoreConstants,
        CoreConfigConstants: CoreConstants.CONFIG,
        CoreCacheUpdateFrequency,
        DownloadStatus,
        MINIMUM_MOODLE_VERSION,
        MOODLE_RELEASES,
    };
    /* eslint-enable @typescript-eslint/naming-convention */
}

@NgModule({
    imports: [
        CoreFeaturesModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CoreInterceptor, multi: true },
        { provide: ApplicationInitStatus, useClass: CoreApplicationInitStatus, deps: [Injector] },
        ...getDatabaseProviders(),
        ...getInitializerProviders(),
    ],
})
export class CoreModule {}
