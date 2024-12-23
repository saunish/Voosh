export interface UserInterface {
	userId?: number;
	userUuid?: string;
	username: string;
	email: string;
	isEmailVerified?: boolean;
	mobile: string | null;
	isMobileVerified?: boolean;
	roleId: number;
	isSso?: boolean;
	active?: boolean;
	archive?: boolean;
	createdDate?: Date;
	updatedDate?: Date;
}
