import type { Access, PayloadRequest } from 'payload'

/** Staff are accounts in the `users` collection (the admin panel). Dealers log in separately. */
export const isStaffUser = (req: PayloadRequest): boolean => req.user?.collection === 'users'

export const isDealerUser = (req: PayloadRequest): boolean => req.user?.collection === 'dealers'

export const staffOnly: Access = ({ req }) => isStaffUser(req)
