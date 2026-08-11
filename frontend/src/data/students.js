const students = [
  {
    id: "IPS2024001",
    name: "Rahul Sharma",
    photo: "https://i.pravatar.cc/300?img=1",
    enrollment: "IPS2024001",
    course: "B.Tech",
    department: "Computer Science & Engineering",
    vehicle: "MP07AB1234",

    blacklisted: false,

    subscription: {
      active: true,
      validFrom: "2026-08-01",
      validTill: "2026-08-31",
    },
  },

  {
    id: "IPS2024002",
    name: "Priya Verma",
    photo: "https://i.pravatar.cc/300?img=5",
    enrollment: "IPS2024002",
    course: "MBA",
    department: "Management",
    vehicle: "MP07CD5678",

    blacklisted: false,
subscription: {
      active: true,
      validFrom: "2026-08-01",
      validTill: "2026-08-31",
    },
  },

  {
    id: "IPS2024003",
    name: "Amit Singh",
    photo: "https://i.pravatar.cc/300?img=8",
    enrollment: "IPS2024003",
    course: "B.Tech",
    department: "Mechanical Engineering",
    vehicle: "MP07EF9999",

    blacklisted: true,

    subscription: {
      active: true,
      validFrom: "2026-08-01",
      validTill: "2026-08-31",
    },
  },

  {
    id: "IPS2024004",
    name: "Neha Gupta",
    photo: "https://i.pravatar.cc/300?img=9",
    enrollment: "IPS2024004",
    course: "B.Tech",
    department: "Civil Engineering",
    vehicle: "MP07GH4567",

    blacklisted: false,

    subscription: null,
  },
];

export default students;