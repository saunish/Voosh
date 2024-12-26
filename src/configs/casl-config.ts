import { PureAbility, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'User' | 'Artist' | 'Album' | 'Track' | 'Favorite' | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

export function defineAbilityFor(role: string): AppAbility {
	const { can, cannot, build } = new AbilityBuilder<PureAbility<[Actions, Subjects]>>(PureAbility as AbilityClass<AppAbility>);

	if (role === 'admin') {
		can('manage', 'all'); // Admin can perform any action on any resource
	} else if (role === 'editor') {
		can(['create', 'read', 'update', 'delete'], ['Artist', 'Album', 'Track', 'User']);
		cannot('delete', 'User'); // Editors cannot delete users
	} else if (role === 'viewer') {
		can('read', ['Artist', 'Album', 'Track']);
	} else {
		cannot('manage', 'all'); // Deny everything for unrecognized roles
	}

	return build({
		detectSubjectType: (item: { constructor: new (...args: unknown[]) => unknown }) => item.constructor as unknown as ExtractSubjectType<Subjects>,
	});
}
