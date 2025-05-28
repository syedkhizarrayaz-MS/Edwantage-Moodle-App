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

import { Injectable } from '@angular/core';

import { CoreBlockHandlerData } from '@features/block/services/block-delegate';
import { CoreBlockBaseHandler } from '@features/block/classes/base-block-handler';
import { makeSingleton } from '@singletons';
import { CoreTag } from '@features/tag/services/tag';

/**
 * Block handler.
 */
@Injectable({ providedIn: 'root' })
export class AddonBlockTagsHandlerService extends CoreBlockBaseHandler {

    name = 'AddonBlockTags';
    blockName = 'tags';

    /**
     * @inheritdoc
     */
    async isEnabled(): Promise<boolean> {
        return await CoreTag.areTagsAvailable();
    }

    /**
     * @inheritdoc
     */
    async getDisplayData(): Promise<CoreBlockHandlerData> {
        const { AddonBlockTagsComponent } = await import('../components/tags/tags');

        return {
            title: 'addon.block_tags.pluginname',
            class: 'addon-block-tags',
            component: AddonBlockTagsComponent,
        };
    }

}

export const AddonBlockTagsHandler = makeSingleton(AddonBlockTagsHandlerService);
