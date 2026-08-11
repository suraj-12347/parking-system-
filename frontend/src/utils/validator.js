import { getStudent } from "../api/studentApi";



export const validateEntry = async (studentId) => {

  try {

    // 1. Student API se fetch
    const response = await getStudent(studentId);

    const student = response.student;


    if (!student) {
      return {
        status: "danger",
        message: "Student Not Found",
      };
    }


    // 2. Subscription Check
    if (!student.subscription_active) {
      return {
        status: "danger",
        message: "No Parking Subscription",
        student,
      };
    }




    // 3. Blacklist Check
    if (student.blacklisted) {
      return {
        status: "danger",
        message: "Student Blacklisted",
        student,
      };
    }


    // 4. Already Inside Check
    const sessions =
  JSON.parse(localStorage.getItem("parkingSessions")) || [];


const activeSession = sessions.find(
  (item) =>
    String(item.studentId).trim() === String(student.enrollment).trim() &&
    item.status === "inside"
);


console.log("SESSION CHECK:", sessions);
console.log("ACTIVE SESSION:", activeSession);


if (activeSession) {
  return {
    status: "danger",
    message: "Student Already Inside",
    student,
  };
}


return {
  status: "success",
  message: "Entry Allowed",
  student,
};


  } catch (error) {

    return {
      status: "danger",
      message: "Student verification failed",
    };

  }

};





export const validateExit = async (studentId) => {

  try {

    // Student API se fetch
    const response = await getStudent(studentId);

    const student = response.student;


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
        item.enrollment === studentId &&
        item.status === "inside"
    );


    if (!activeSession) {
      return {
        status: "danger",
        message: "Exit Without Entry",
        student,
      };
    }


    return {
      status: "success",
      message: "Exit Successful",
      student,
      session: activeSession,
    };


  } catch(error) {

    return {
      status:"danger",
      message:"Exit verification failed",
    };

  }

};