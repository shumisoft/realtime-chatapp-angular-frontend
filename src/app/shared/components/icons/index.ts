/**
 * Icons Barrel File (Convenience pattern)
 * -----------------
 * This file re-exports icon components from a single entry point.
 *
 * ! This pattern is NOT mandatory.
 * It is used purely as a convenience to:
 *  - Simplify imports across the application
 *  - Avoid long relative import paths
 *  - Provide a centralized location for shared icon exports
 *
 * Example without barrel:
 *   import { ChatAddOn } from '../../shared/components/icons/chat-add-on/chat-add-on';
 *   import { MoreVertical } from '../../shared/components/icons/more-vertical/more-vertical';
 *
 * Example with barrel (preferred for readability):
 *   import { ChatAddOn, MoreVertical } from './shared/components/icons';
 *
 * If this file is removed, icons can still be imported directly from their individual paths.
 */

export { AddComment } from './add-comment/add-comment';

export { AddPhotoAlternate } from './add-photo-alternate/add-photo-alternate';

export { AttachFile } from './attach-file/attach-file';

export { ChatAddOn } from './chat-add-on/chat-add-on';

export { Check } from './check/check';

export { Close } from './close/close';

export { Delete } from './delete/delete';

export { DoneAll } from './done-all/done-all';

export { Edit } from './edit/edit';

export { Folder } from './folder/folder';

export { FolderOpen } from './folder-open/folder-open';

export { GroupAdd } from './group-add/group-add';

export { Logout } from './logout/logout';

export { MoreVertical } from './more-vertical/more-vertical';

export { PersonAdd } from './person-add/person-add';

export { PersonRemove } from './person-remove/person-remove';

export { PersonShield } from './person-shield/person-shield';

export { Search } from './search/search';

export { Send } from './send/send';

export { Upload } from './upload/upload';

export { Visibility } from './visibility/visibility';

export { Schedule } from './schedule/schedule';
