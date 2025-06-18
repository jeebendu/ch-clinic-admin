export interface MedicalCollege {
    id: number;
    name: string;
    state: string;
    course: MedicalCourse;
    university: MedicalUniversity;
}

export interface MedicalUniversity {
    id: number;
    name: string;
    state: string;
    course: MedicalCourse;
    university: MedicalUniversity;
}
export interface MedicalCourse {
    id: number;
    name: string;
    state: string;
    course: MedicalCourse;
    university: MedicalUniversity;
}
