export const ENVIRONMENT = {
  baseUrl: 'https://symuapi-production.up.railway.app/symu',
  endpoints: {
    users: {
      getAll: '/user/getAllUsers',
      create: '/user/createOrUpdateUser',
      update: '/user/createOrUpdateUser',
      delete: '',
      login: '/user/login',
      logout: 'user/logout',
      forgotPassword: '',
      resetPassword: '',
      roles: {
        getAll: '/role/getAllRoles',
      },
    },
    countries: {
      getAll: '/country/getAllCountries',
      create: '/country/createOrUpdateCountry',
      update: '/country/createOrUpdateCountry',
      delete: '',
    },
    regions: {
      getAll: '/region/getRegionByCompany',
      create: '/region/createOrUpdateRegion',
      update: '/region/createOrUpdateRegion',
      delete: '',
    },
    branches: {
      getAll: '/branch/getBranches',
      create: '/branch/createOrUpdateBranch',
      update: '/branch/createOrUpdateBranch',
      delete: '',
    },
    phoneModels: {
      getAll: '/stock-model/getAllStockModels',
      create: '/stock-model/createOrUpdateStockModel',
      update: '/stock-model/createOrUpdateStockModel',
      delete: '',
    },
    stockStatus: {
      getAll: '/stock-status/getAllStockStatus',
      create: '/stock-status/creatOrUpdateStockStatus',
      update: '/stock-status/creatOrUpdateStockStatus',
      delete: '',
    },
    stock: {
      status: {
        getAll: '/stock-status/getAllStockStatus',
        create: '/stock-status/creatOrUpdateStockStatus',
        update: '/stock-status/creatOrUpdateStockStatus',
        delete: '',
      },
      model: {
        getAll: '/stock-model/getAllStockModels',
        create: '/stock-model/createOrUpdateStockModel',
        update: '/stock-model/createOrUpdateStockModel',
        delete: '',
      },
      batch: {
        getAll: '/stock-batch/getAllStockBatch',
        create: '/stock-batch/createOrUpdateStockBatch',
        update: '/stock-batch/createOrUpdateStockBatch',
        delete: '',
      },
      phone: {
        getAll: '/stock/getAllStock',
        create: '/stock/createOrUpdateStock',
        update: '/stock/createOrUpdateStock',
        delete: '',
        setPrice: '/stock/updateStockPrice',
        postSale: '/stock/stockPostSale',
        closeSale: '/stock/stockCloseSale',
        rejectSale: '/stock/stockRejectPostedSale'
      },
      queryReceipt: '/receipt/getAllByReceiptStockCode',
    },
    dealership: {
      getAll: '/dealership/getAllByCompanyCode',
    },
  },
};