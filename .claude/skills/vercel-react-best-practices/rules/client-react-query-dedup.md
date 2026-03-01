---
title: Use React Query for Automatic Deduplication
impact: MEDIUM-HIGH
impactDescription: automatic deduplication
tags: client, react-query, tanstack, deduplication, data-fetching
---

## Use React Query for Automatic Deduplication

React Query (@tanstack/react-query) enables request deduplication, caching, and revalidation across component instances.

**Incorrect (no deduplication, each instance fetches):**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**Correct (multiple instances share one request):**

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

function UserList() {
  const { data: users } = useSuspenseQuery(getUsersQueryOptions())
}
```

**For immutable/static data:**

```tsx
export const getConfigQueryOptions = () => ({
  queryKey: ['config'],
  queryFn: () => fetch('/api/config').then(r => r.json()),
  staleTime: Infinity,
})

function StaticContent() {
  const { data } = useSuspenseQuery(getConfigQueryOptions())
}
```

**For mutations:**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function UpdateButton() {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
  return <button onClick={() => mutate()}>Update</button>
}
```

**With openapi-react-query (as used in this project):**

```tsx
import { $api } from '@app/utils/api/apiRequests'

// Query options pattern
export const getUserQueryOptions = () => $api.queryOptions("get", "/user", {})

// Usage with useSuspenseQuery
function UserProfile() {
  const { data } = useSuspenseQuery(getUserQueryOptions())
}

// Mutations
function UpdateUser() {
  const mutation = $api.useMutation("put", "/user", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
```

Reference: [https://tanstack.com/query](https://tanstack.com/query)
