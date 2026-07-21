const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

type PoolListResponse = {
  pools?: Array<Record<string, string>>
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}

function withParams(path: string, params: Record<string, string>) {
  const search = new URLSearchParams(params)
  return `${path}?${search.toString()}`
}

export const apiClient = {
  // ====== 系统检测 ======
  rpc: {
    status: async () => {
      return request('/rpc/status')
    },
  },

  system: {
    health: async () => {
      return request('/system/health')
    },
  },

  // ====== 白名单管理 ======
  whitelist: {
    check: async (address: string) => {
      return request('/whitelist/check', {
        method: 'POST',
        body: JSON.stringify({ address }),
      })
    },

    list: async () => {
      return request('/whitelist/list')
    },
  },

  // ====== 池子信息 ======
  pool: {
    info: async (poolAddress: string) => {
      return request(withParams('/pool/info', { pool_address: poolAddress }))
    },

    list: async () => {
      return request<PoolListResponse>('/pool/list')
    },
  },

  // ====== 用户信息 ======
  user: {
    info: async (address: string) => {
      return request(withParams('/user/info', { address }))
    },

    authorizations: async (address: string) => {
      return request(withParams('/user/authorizations', { address }))
    },

    transactions: async (address: string) => {
      return request(withParams('/user/transactions', { address }))
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
      return request('/authorization/initiate', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    submit: async (data: { authorization_id: number; tx_hash: string }) => {
      return request('/authorization/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    confirm: async (data: { authorization_id: number }) => {
      return request('/authorization/confirm', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    status: async (id: number) => {
      return request(`/authorization/status/${id}`)
    },

    steps: async () => {
      return request('/authorization/steps')
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
      return request('/transaction/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    status: async (txHash: string) => {
      return request(`/transaction/status/${txHash}`)
    },

    history: async (userAddress: string) => {
      return request(`/transaction/history/${userAddress}`)
    },
  },
}
