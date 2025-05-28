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
import { CoreCourseBlock } from '@features/course/services/course';
import { makeSingleton } from '@singletons';
import { CoreComments } from '@features/comments/services/comments';
import { ContextLevel } from '@/core/constants';

/**
 * Block handler.
 */
@Injectable({ providedIn: 'root' })
export class AddonBlockCommentsHandlerService extends CoreBlockBaseHandler {

    name = 'AddonBlockComments';
    blockName = 'comments';

    /**
     * @inheritdoc
     */
    async isEnabled(): Promise<boolean> {
        return await CoreComments.areCommentsEnabled();
    }

    /**
     * @inheritdoc
     */
    async getDisplayData(block: CoreCourseBlock, contextLevel: ContextLevel, instanceId: number): Promise<CoreBlockHandlerData> {
        const { CoreBlockOnlyTitleComponent } = await import('@features/block/components/only-title-block/only-title-block');

        return {
            title: 'addon.block_comments.pluginname',
            class: 'addon-block-comments',
            component: CoreBlockOnlyTitleComponent,
            link: `comments/${contextLevel}/${instanceId}/block_comments/0`,
            linkParams: {
                area: 'page_comments',
            },
        };
    }

}

export const AddonBlockCommentsHandler = makeSingleton(AddonBlockCommentsHandlerService);
