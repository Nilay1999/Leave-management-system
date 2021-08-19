const roles = {
  ADMIN: {
    leaves: {
      myleaves: {
        add: true,
        update: true,
        delete: true,
      },
      teamLeaves: {
        approve: true,
      },
    },
  },
  TL: {
    leaves: {
      myleaves: {
        add: true,
        update: true,
        delete: false,
      },
      teamLeaves: {
        approve: true,
      },
    },
  },
  EMP: {
    leaves: {
      myleaves: {
        add: true,
        update: true,
        delete: false,
      },
      teamLeaves: {
        approve: false,
      },
    },
  },
  HR: {
    leaves: {
      myleaves: {
        add: true,
        update: true,
        delete: true,
      },
      teamLeaves: {
        approve: true,
      },
    },
  },
  PM: {
    leaves: {
      myleaves: {
        add: true,
        update: true,
        delete: false,
      },
      teamLeaves: {
        approve: true,
      },
    },
  },
};
export default roles;
