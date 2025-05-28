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

import { APP_INITIALIZER, NgModule, Type } from '@angular/core';
import { Routes } from '@angular/router';
import { CoreContentLinksDelegate } from '@features/contentlinks/services/contentlinks-delegate';
import { CoreCourseHelper } from '@features/course/services/course-helper';
import { CoreCourseModuleDelegate } from '@features/course/services/module-delegate';
import { CoreCourseModulePrefetchDelegate } from '@features/course/services/module-prefetch-delegate';
import { CoreMainMenuTabRoutingModule } from '@features/mainmenu/mainmenu-tab-routing.module';
import { CoreCronDelegate } from '@services/cron';
import { CORE_SITE_SCHEMAS } from '@services/sites';
import { AddonModWorkshopAssessmentStrategyModule } from '@addons/mod/workshop/assessment/assessment.module';
import { ADDON_MOD_WORKSHOP_OFFLINE_SITE_SCHEMA } from './services/database/workshop';
import { AddonModWorkshopIndexLinkHandler } from './services/handlers/index-link';
import { AddonModWorkshopListLinkHandler } from './services/handlers/list-link';
import { AddonModWorkshopModuleHandler } from './services/handlers/module';
import { ADDON_MOD_WORKSHOP_COMPONENT, ADDON_MOD_WORKSHOP_PAGE_NAME } from '@addons/mod/workshop/constants';
import { getPrefetchHandlerInstance } from '@addons/mod/workshop/services/handlers/prefetch';
import { getCronHandlerInstance } from '@addons/mod/workshop/services/handlers/sync-cron';
import { canLeaveGuard } from '@guards/can-leave';

/**
 * Get modworkshop services.
 *
 * @returns modWorkshop services.
 */
export async function getModWorkshopServices(): Promise<Type<unknown>[]> {
    const { AddonModWorkshopProvider } = await import('@addons/mod/workshop/services/workshop');
    const { AddonModWorkshopOfflineProvider } = await import('@addons/mod/workshop/services/workshop-offline');
    const { AddonModWorkshopSyncProvider } = await import('@addons/mod/workshop/services/workshop-sync');
    const { AddonModWorkshopHelperProvider } = await import('@addons/mod/workshop/services/workshop-helper');
    const { AddonWorkshopAssessmentStrategyDelegateService } =
        await import('@addons/mod/workshop/services/assessment-strategy-delegate');

    return [
        AddonModWorkshopProvider,
        AddonModWorkshopOfflineProvider,
        AddonModWorkshopSyncProvider,
        AddonModWorkshopHelperProvider,
        AddonWorkshopAssessmentStrategyDelegateService,
    ];
}

/**
 * Get workshop component modules.
 *
 * @returns Workshop component modules.
 */
export async function getModWorkshopComponentModules(): Promise<Type<unknown>[]> {
    const { AddonModWorkshopAssessmentStrategyComponent } =
        await import('@addons/mod/workshop/components/assessment-strategy/assessment-strategy');

    return [AddonModWorkshopAssessmentStrategyComponent];
}

const routes: Routes = [
    {
        path: ADDON_MOD_WORKSHOP_PAGE_NAME,
        loadChildren: () => [
            {
                path: ':courseId/:cmId',
                loadComponent: () => import('./pages/index/index'),
            },
            {
                path: ':courseId/:cmId/:submissionId',
                loadComponent: () => import('./pages/submission/submission'),
                canDeactivate: [canLeaveGuard],
            },
            {
                path: ':courseId/:cmId/:submissionId/edit',
                loadComponent: () => import('./pages/edit-submission/edit-submission'),
                canDeactivate: [canLeaveGuard],
            },
            {
                path: ':courseId/:cmId/:submissionId/:assessmentId',
                loadComponent: () => import('./pages/assessment/assessment'),
                canDeactivate: [canLeaveGuard],
            },
        ],
    },
];

@NgModule({
    imports: [
        CoreMainMenuTabRoutingModule.forChild(routes),
        AddonModWorkshopAssessmentStrategyModule,
    ],
    providers: [
        {
            provide: CORE_SITE_SCHEMAS,
            useValue: [ADDON_MOD_WORKSHOP_OFFLINE_SITE_SCHEMA],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useValue: () => {
                CoreCourseModulePrefetchDelegate.registerHandler(getPrefetchHandlerInstance());
                CoreCronDelegate.register(getCronHandlerInstance());

                CoreCourseModuleDelegate.registerHandler(AddonModWorkshopModuleHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModWorkshopIndexLinkHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModWorkshopListLinkHandler.instance);

                CoreCourseHelper.registerModuleReminderClick(ADDON_MOD_WORKSHOP_COMPONENT);
            },
        },
    ],
})
export class AddonModWorkshopModule {}
