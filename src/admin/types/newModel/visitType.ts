import { Country } from "../country";
import { District } from "../district";
import { Doctor } from "../doctor";
import { State } from "./state";


export class AppoinmentRequest {

    id!:number;
    firstName!:String;
    lastName!:String;
    email!:String;
    phone!:number;
    dob!:Date;
    gender!:number;
    district:District;
    state:State;
    country:Country;
    city!:String;
    appointmentDate!:String;
    isAccept:boolean;
    isReject:boolean;
    doctor!:Doctor;
    appointmentType:appointmentType;
    visitType:visitType;
    // status

    
}

// private Long id;

// private String firstName;

// private String lastName;

// private Boolean isAccept;

// private Boolean isReject;

// @NotNull(message = "Email is mandatory")
// private String email;

// @NotNull(message = "Mobile is mandatory" )
// private String phone;

// private Date appointmentDate;

// private DoctorDto doctor;

// private Date dob;

// private Branch branch;

// private AppointmentType appointmentType;

// private VisitType visitType;

// private Integer gender;

// private District district;

// private Country couinterface

// private State state;

// private String city;

export interface SearchRequest {
    
    date:Date;
}

export interface StatusUpdate {
    status:Boolean;
}


export interface visitType {
    id:number;
    name:String;
}


export interface appointmentType {
    id:number;
    name:String;
}