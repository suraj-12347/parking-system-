// parkingValidation.js

import { getStudent } from "../api/studentApi";


// ================= ENTRY VALIDATION =================

export const validateEntry = async (studentId) => {

  try {

    console.log("VALIDATE ENTRY:", studentId);


    // Student API se fetch
    const response = await getStudent(studentId);


    // API response handle
    const student = response.student || response;


    console.log("STUDENT DATA:", student);


    if (!student) {
      return {
        status: "danger",
        message: "Student Not Found",
      };
    }



    // Subscription Check
    if (!student.subscription_active) {

      return {
        status: "danger",
        message: "No Parking Subscription",
        student,
      };

    }



    // Blacklist Check
    if (student.blacklisted) {

      return {
        status: "danger",
        message: "Student Blacklisted",
        student,
      };

    }



    // Active Sessions Check
    const sessions =
      JSON.parse(localStorage.getItem("parkingSessions")) || [];


    console.log("CURRENT SESSIONS:", sessions);


    const activeSession = sessions.find(
      (item) =>
        String(item.studentId).trim() ===
        String(student.enrollment).trim()
        &&
        item.status === "inside"
    );


    console.log(
      "ACTIVE SESSION:",
      activeSession
    );



    if (activeSession) {

      return {
        status: "danger",
        message: "Student Already Inside",
        student,
        session: activeSession,
      };

    }



    return {

      status: "success",

      message: "Entry Allowed",

      student,

    };



  } catch (error) {


    console.log(
      "ENTRY VALIDATION ERROR:",
      error
    );


    return {

      status: "danger",

      message: "Student verification failed",

    };


  }

};






// ================= EXIT VALIDATION =================


export const validateExit = async (studentId) => {


  try {


    console.log(
      "VALIDATE EXIT:",
      studentId
    );



    const response = await getStudent(studentId);


    const student = response.student || response;



    if (!student) {

      return {

        status: "danger",

        message: "Student Not Found",

      };

    }



    const sessions =
      JSON.parse(localStorage.getItem("parkingSessions")) || [];



    const activeSession = sessions.find(

      (item) =>

        String(item.studentId).trim() ===
        String(student.enrollment).trim()

        &&

        item.status === "inside"

    );



    if (!activeSession) {


      return {

        status: "danger",

        message: "No Active Parking Session",

        student,

      };


    }



    return {

      status: "success",

      message: "Exit Allowed",

      student,

      session: activeSession,

    };



  } catch(error) {


    console.log(
      "EXIT VALIDATION ERROR:",
      error
    );


    return {

      status:"danger",

      message:"Exit verification failed",

    };


  }


};