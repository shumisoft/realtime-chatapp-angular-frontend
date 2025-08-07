import { ChatRoom } from '../models/message.model';
import { UserState } from '../models/user.models';

/**
 * Utility helper for deriving presentation-level data
 * from a {@link ChatRoom} entity.
 *
 * This class contains pure, side-effect free static methods
 * used to resolve display name, avatar and participant data
 * for both direct messages and group chat rooms.
 *
 * @remarks
 * This utility is intentionally framework-agnostic and does not
 * depend on Angular or NgRx. It can safely be reused in selectors,
 * components, or mappers.
 */
export class ChatRoomUtil {
  /**
   * Determines whether a given chat room is a direct message.
   *
   * @param room - The chat room instance.
   * @returns `true` if the room type is DIRECT_MESSAGE; otherwise `false`.
   */
  static isDirectMessage(room: ChatRoom | null): boolean {
    return room?.type === 'DIRECT_MESSAGE';
  }

  /**
   * Retrieves the "other" participant in a direct message.
   *
   * @param room - The chat room instance.
   * @param principal - The currently authenticated user.
   * @returns The other {@link UserState} in the DM, or `null`
   * if the room is not a direct message or data is incomplete.
   */
  static getOtherUser(room: ChatRoom | null | undefined, principal: UserState | null | undefined) {
    if (!room || !principal || !this.isDirectMessage(room)) return null;

    return room.members.map((m) => m.user).find((u) => u.userId !== principal.userId) || null;
  }

  /**
   * Resolves the display name of a chat room.
   *
   * - For direct messages → returns the other user's full name.
   * - For group chats → returns the room's name.
   *
   * @param room - The chat room instance.
   * @param principal - The currently authenticated user.
   * @returns The resolved display name, or `null` if unavailable.
   */
  static getRoomName(
    room: ChatRoom | null | undefined,
    principal: UserState | null | undefined,
  ): string | null | undefined {
    if (!room) return null;

    if (this.isDirectMessage(room)) {
      return this.getOtherUser(room, principal)?.fullName ?? null;
    }

    return room.name;
  }

  /**
   * Resolves the display avatar image for a chat room.
   *
   * - For direct messages → returns the other user's avatar.
   * - For group chats → returns the room icon.
   *
   * @param room - The chat room instance.
   * @param principal - The currently authenticated user.
   * @returns Avatar image URL or `null` if not defined.
   */
  static getRoomImage(
    room: ChatRoom | null | undefined,
    principal: UserState | null | undefined,
  ): string | null {
    if (!room) return null;

    if (this.isDirectMessage(room)) {
      return this.getOtherUser(room, principal)?.avatar ?? null;
    }

    return room.icon ?? null;
  }
}
