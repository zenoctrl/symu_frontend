export const ENVIRONMENT = {
  baseUrl: 'https://symuapi-production.up.railway.app',
  endpoints: {
    users: {
      getAll: '/symu/user/getAllUsers',
      create: '/symu/user/createOrUpdateUser',
      update: '/symu/user/createOrUpdateUser',
      delete: '',
      login: '/symu/user/login',
      logout: '/symu/user/logout',
      forgotPassword: '',
      resetPassword: '',
      roles: {
        getAll: '/symu/role/getAllRoles',
        create: '/symu/role/createOrUpdateRole',
        update: '/symu/role/createOrUpdateRole',
      },
    },
    countries: {
      getAll: '/symu/country/getAllCountries',
      create: '/symu/country/createOrUpdateCountry',
      update: '/symu/country/createOrUpdateCountry',
      delete: '',
    },
    regions: {
      getAll: '/symu/region/getRegionByCompany',
      create: '/symu/region/createOrUpdateRegion',
      update: '/symu/region/createOrUpdateRegion',
      delete: '',
    },
    branches: {
      getAll: '/symu/branch/getBranches',
      create: '/symu/branch/createOrUpdateBranch',
      update: '/symu/branch/createOrUpdateBranch',
      delete: '',
    },
    clusters: {
      getAll: '/symu/cluster/getAllClustersByBranch',
      create: '/symu/cluster/createOrUpdateCluster',
      update: '/symu/cluster/createOrUpdateCluster',
      delete: '',
    },
    phoneModels: {
      getAll: '/symu/stock-model/getAllStockModels',
      create: '/symu/stock-model/createOrUpdateStockModel',
      update: '/symu/stock-model/createOrUpdateStockModel',
      delete: '',
    },
    stockStatus: {
      getAll: '/symu/stock-status/getAllStockStatus',
      create: '/symu/stock-status/creatOrUpdateStockStatus',
      update: '/symu/stock-status/creatOrUpdateStockStatus',
      delete: '',
    },
    stock: {
      status: {
        getAll: '/symu/stock-status/getAllStockStatus',
        create: '/symu/stock-status/creatOrUpdateStockStatus',
        update: '/symu/stock-status/creatOrUpdateStockStatus',
        delete: '',
      },
      model: {
        getAll: '/symu/stock-model/getAllStockModels',
        create: '/symu/stock-model/createOrUpdateStockModel',
        update: '/symu/stock-model/createOrUpdateStockModel',
        delete: '',
      },
      batch: {
        getAll: '/symu/stock-batch/getAllStockBatch',
        create: '/symu/stock-batch/createOrUpdateStockBatch',
        update: '/symu/stock-batch/createOrUpdateStockBatch',
        delete: '',
      },
      phone: {
        getAll: '/symu/stock/getAllStock',
        getAllStockDetails: '/symu/stock/getAllStockDetails',
        create: '/symu/stock/createOrUpdateStock',
        update: '/symu/stock/createOrUpdateStock',
        delete: '',
        setPrice: '/symu/stock/updateStockPrice',
        postSale: '/symu/stock/stockPostSale',
        closeSale: '/symu/stock/stockCloseSale',
        rejectSale: '/symu/stock/stockRejectPostedSale',
        updateDefaultStatus: '/symu/stock/updateDefaultStatus',
        search: '/symu/stock/getAllStockDetailsByImei'
      },
      queryReceipt: '/symu/receipt/getAllByReceiptStockCode',
      bulk: {
        create: '/symu/stock/createStockBulk',
        approve: '/symu/stock/stockApproval',
      },
    },
    dealership: {
      getAll: '/symu/dealership/getAllByCompanyCode',
      create: '/symu/dealership/createOrUpdateDealership',
      update: '/symu/dealership/createOrUpdateDealership',
    },
  },
};
