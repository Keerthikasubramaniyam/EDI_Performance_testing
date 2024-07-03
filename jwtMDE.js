const jwt = require("jsonwebtoken");

const getBackDoorToken = () => {
  return jwt.sign(
    {
      userId: "20033",
      visualId: "725650",
      cws: "3",
      scope: {
        visualUser: true,
        workspaceAdmin: true,
        comments: true,
        scheduler: true,
        writeBackAPI: true,
        versioning: true,
        customTheme: true,
        dataInput: true,
        exportPDF: true,
        exportXLS: true,
        mde: true,
        mdeBulkEdit: true,
        mdeApprovalsDefault: true,
        mdeApprovalsRules: true,
        mdeApprovalsLookup: true,
        mdeApprovalsPersistFlag: true,
        mdeScd: true,
        mdeWebhook: true,
        mdeAcl: true,
      },
      aud: "mde",
      roles: [
        {
          id: "5",
          name: "VISUAL_USER",
        },
        {
          id: "1",
          name: "WORKSPACE_ADMIN",
        },
      ],
      isBackDoor: true,
      // licenseMeta: {
      //   user: "ashwin",
      //   email: "ashwinkr@lumel.com",
      //   status: 10,
      //   expiry: 1749743899,
      //   users_limit: 75,
      //   startDate: 1634656334,
      //   schedulerJobLimit: 50,
      //   autoCreateUser: 0,
      //   buildType: "enterprise",
      //   features: {
      //     audit: 1,
      //     writeBackAPI: 1,
      //     exportPDF: 1,
      //     exportXLS: 1,
      //     kpiExplorer: 1,
      //     scheduler: 1,
      //     forecast: 1,
      //     blend: 1,
      //     comments: 1,
      //     versioning: 1,
      //     premium: 1,
      //     professional: 1,
      //     standard: 1,
      //     dataInput: 1,
      //     customTheme: 1,
      //     allowExternalEmails: 1,
      //     dataSourceIntegration: 1,
      //     mde: 1,
      //   },
      //   products: {
      //     mde: {
      //       user: "ashwin",
      //       email: "ashwinkr@lumel.com",
      //       status: 10,
      //       expiry: 1749743899,
      //       users_limit: 75,
      //       subscriptionId: "xyz",
      //       trial: false,
      //     },
      //   },
      // },
    },
    "69aU74C-60f9guU=IlVt96Qf_9t8Jb1YyzrQ_fS5DklVx",
    {
      expiresIn: 36 * 36 * 2400,
    }
  );
};
console.log(getBackDoorToken());

const createRefreshToken = () => {
  return jwt.sign({ userId: "18" }, "69aU74C-60f9guU=IlVt96Qf_9t8Jb1YyzrQ_fS5DklVx", {
    expiresIn: 60 * 60 * 24 * 365,
  });
};
