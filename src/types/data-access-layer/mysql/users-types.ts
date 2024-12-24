export interface UserInterface {
	userId?: string;
	email: string;
	password: string;
	role: 'admin' | 'editor' | 'viewer';
	parent_id?: string;
	createdDate?: Date;
	updatedDate?: Date;
}
