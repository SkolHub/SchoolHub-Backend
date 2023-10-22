export interface account {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    email: string
}

export interface grade {
    id: number,
    date: Date,
    value: string
}

export interface absence {
    id: number,
    date: Date,
    excused: boolean
}

export interface post {
    id: number,
    title: string,
    body: string,
    creator: account,
    type: string,
    classId: string
}

export interface schoolClass {
    id: number,
    theme: string,
    icon: string,
    name: string,
    identifier: string,
    subject: string,
    creator: account,
    announcements: post[],
    assignments: post[],
    absences: absence[],
    grades: grade[]
}

export interface organization {
    name: string,
    id: string,
    role: string,
    announcements: post[],
    assignments: post[],
    absences: absence[],
    grades: grade[],
    classes: schoolClass[]
}