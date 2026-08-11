let sessions = JSON.parse(
  localStorage.getItem("parkingSessions")
) || [
  {
    id: "SES2026001",
    studentId: "IPS2024001",
    vehicleNumber: "MP07AB1234",
    entryTime: "09:15 AM",
    exitTime: null,
    status: "inside",
    parkingSlot: "A-12",
    verifiedBy: "Watchman",
    paymentStatus: "active",
  },
];


export const getSessions = () => {
  return sessions;
};


export const addSession = (session) => {

  sessions.push(session);

  localStorage.setItem(
    "parkingSessions",
    JSON.stringify(sessions)
  );

  return session;
};


export const updateSession = (id, data) => {

  sessions = sessions.map((item) =>
    item.id === id
      ? { ...item, ...data }
      : item
  );


  localStorage.setItem(
    "parkingSessions",
    JSON.stringify(sessions)
  );

};


export default sessions;