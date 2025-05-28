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
import { CoreContentLinksModuleListHandler } from '@features/contentlinks/classes/module-list-handler';
import { makeSingleton } from '@singletons';
import { ADDON_MOD_CHAT_COMPONENT, ADDON_MOD_CHAT_MODNAME } from '../../constants';

/**
 * Handler to treat links to chat list page.
 */
@Injectable({ providedIn: 'root' })
export class AddonModChatListLinkHandlerService extends CoreContentLinksModuleListHandler {

    name = 'AddonModChatListLinkHandler';

    constructor() {
        super(ADDON_MOD_CHAT_COMPONENT, ADDON_MOD_CHAT_MODNAME);
    }

}

export const AddonModChatListLinkHandler = makeSingleton(AddonModChatListLinkHandlerService);
