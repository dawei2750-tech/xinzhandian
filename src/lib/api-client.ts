import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export const apiClient = {
  // ====== 系统检测 ======
  rpc: {
    status: async () => {
      const res = await axios.get(`${API_BASE_URL}/rpc/status`)
      return res.data
    },
  },

  system: {
    health: async () => {
      const res = await axios.get(`${API_BASE_URL}/system/health`)
      return res.data
    },
  },

  // ====== 白名单管理 ======
  whitelist: {
    check: async (address: string) => {
      const res = await axios.post(`${API_BASE_URL}/whitelist/check`, {
        address,
      })
      return res.data
    },

    list: async () => {
      const res = await axios.get(`${API_BASE_URL}/whitelist/list`)
      return res.data
    },
  },

  // ====== 池子信息 ======
  pool: {
    info: async (poolAddress: string) => {
      const res = await axios.get(`${API_BASE_URL}/pool/info`, {
        params: { pool_address: poolAddress },
      })
      return res.data
    },

    list: async () => {
      const res = await axios.get(`${API_BASE_URL}/pool/list`)
      return res.data
    },
  },

  // ====== 用户信息 ======
  user: {
    info: async (address: string) => {
      const res = await axios.get(`${API_BASE_URL}/user/info`, {
        params: { address },
      })
      return res.data
    },

    authorizations: async (address: string) => {
      const res = await axios.get(`${API_BASE_URL}/user/authorizations`, {
        params: { address },
      })
      return res.data
    },

    transactions: async (address: string) => {
      const res = await axios.get(`${API_BASE_URL}/user/transactions`, {
        params: { address },
      })
      return res.data
    },
  },

  // ====== 授权流程 (8步) ======
  authorization: {
    initiate: async (data: {
      user_address: string
      token_address: string
      token_name: string
      amount: string
    }) => {
      const res = await axios.post(`${API_BASE_URL}/authorization/initiate`, data)
      return res.data
    },

    submit: async (data: { authorization_id: number; tx_hash: string }) => {
      const res = await axios.post(`${API_BASE_URL}/authorization/submit`, data)
      return res.data
    },

    confirm: async (data: { authorization_id: number }) => {
      const res = await axios.post(`${API_BASE_URL}/authorization/confirm`, data)
      return res.data
    },

    status: async (id: number) => {
      const res = await axios.get(`${API_BASE_URL}/authorization/status/${id}`)
      return res.data
    },

    steps: async () => {
      const res = await axios.get(`${API_BASE_URL}/authorization/steps`)
      return res.data
    },
  },

  // ====== 交易管理 ======
  transaction: {
    submit: async (data: {
      user_address: string
      pool_address: string
      token_address: string
      amount: string
      tx_data?: string
    }) => {
      const res = await axios.post(`${API_BASE_URL}/transaction/submit`, data)
      return res.data
    },

    status: async (txHash: string) => {
      const res = await axios.get(`${API_BASE_URL}/transaction/status/${txHash}`)
      return res.data
    },

    history: async (userAddress: string) => {
      const res = await axios.get(
        `${API_BASE_URL}/transaction/history/${userAddress}`
      )
      return res.data
    },
  },
}
