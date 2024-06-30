export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export interface MemberSession {
	userID: number;
	organizationID: number;
	role: Role;
}

export interface RawMemberSession {
	cookie: Record<string, any>;
	passport: {
		user: MemberSession;
	};
}
