import {
  GROUP_PERMISSIONS,
  Permission,
} from "./permissions";

export function hasPermission(
  accessGroup: string,
  permission: Permission
) {
  const permissions =
    GROUP_PERMISSIONS[
      accessGroup as keyof typeof GROUP_PERMISSIONS
    ];

  if (!permissions) {
    return false;
  }

  return (permissions as readonly Permission[]).includes(permission);
}



/*
 * Defines which document access groups
 * a particular user group can assign.
 */

export const DOCUMENT_ACCESS_RULES = {
  EMPLOYEE: [
    "EMPLOYEE",
  ],
 
  MANAGER: [
    "MANAGER",
    "EMPLOYEE",
  ],

  HR: [
    "HR",
    "EMPLOYEE",
  ],

  FINANCE: [
    "FINANCE",
    "EMPLOYEE",
  ],
  ADMIN: [
    "ADMIN",
    "MANAGER",
    "HR",
    "FINANCE",
    "EMPLOYEE",
  ],
} as const;


/*
 * Checks whether a user is allowed
 * to create a document for the requested group.
 */
export function canAssignDocumentAccess(
  userAccessGroup: string,
  documentAccessGroup: string
) {
  const allowedGroups =
    DOCUMENT_ACCESS_RULES[
      userAccessGroup as keyof typeof DOCUMENT_ACCESS_RULES
    ];

  if (!allowedGroups) {
    return false;
  }

  return allowedGroups.includes(
    documentAccessGroup as never
  );
}