import React, { useMemo, useState } from "react";
import { Plus, MoreHorizontal, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ---- App shell (same as other pages) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/* ------------------------------------------------------------------ */
/* Mock roles & actions – replace with DB rows when wiring backend     */
/* ------------------------------------------------------------------ */
type RoleKey = "ADMIN" | "EXPERT" | "GUEST" | "SUPERADMIN" | "USER";

type RoleDef = {
  key: RoleKey;
  label: string;
};

type ActionDef = {
  code: string; // e.g., ADD_ARTICLE
  label: string; // human label if needed
  help?: string; // tooltip/help text
};

const INITIAL_ROLES: RoleDef[] = [
  { key: "ADMIN", label: "ADMIN" },
  { key: "EXPERT", label: "EXPERT" },
  { key: "GUEST", label: "GUEST" },
  { key: "SUPERADMIN", label: "SUPERADMIN" },
  { key: "USER", label: "USER" },
];

const INITIAL_ACTIONS: ActionDef[] = [
  {
    code: "ADD_ACTION",
    label: "ADD_ACTION",
    help: "Create a new action entity.",
  },
  { code: "ADD_ARTICLE", label: "ADD_ARTICLE", help: "Publish a new article." },
  {
    code: "ADD_CONFIG_FLAG",
    label: "ADD_CONFIG_FLAG",
    help: "Create/edit feature flags.",
  },
  {
    code: "ADD_CONTENT",
    label: "ADD_CONTENT",
    help: "Upload or add content blocks.",
  },
  {
    code: "ADD_INSIGHT",
    label: "ADD_INSIGHT",
    help: "Create analytical insight items.",
  },
  {
    code: "ADD_MANUFACTURER",
    label: "ADD_MANUFACTURER",
    help: "Add vendor/manufacturer.",
  },
  { code: "ADD_ROLE", label: "ADD_ROLE", help: "Create new role definitions." },
  {
    code: "ADD_SUB_TOPIC",
    label: "ADD_SUB_TOPIC",
    help: "Create nested topic.",
  },
  { code: "ADD_TOPIC", label: "ADD_TOPIC", help: "Create top-level topic." },
];

/** permissionMatrix[actionCode][roleKey] = boolean */
const initialMatrix = () => {
  const map: Record<string, Record<RoleKey, boolean>> = {};
  for (const a of INITIAL_ACTIONS) {
    map[a.code] = {
      ADMIN: [
        "ADD_ARTICLE",
        "ADD_CONTENT",
        "ADD_SUB_TOPIC",
        "ADD_TOPIC",
      ].includes(a.code),
      EXPERT: [
        "ADD_ARTICLE",
        "ADD_INSIGHT",
        "ADD_SUB_TOPIC",
        "ADD_TOPIC",
      ].includes(a.code),
      GUEST: false,
      SUPERADMIN: !["ADD_CONFIG_FLAG"].includes(a.code) ? true : true, // super can do all incl. config
      USER: ["ADD_ARTICLE", "ADD_TOPIC"].includes(a.code),
    };
  }
  // Fine-tune a few based on screenshot vibe
  map["ADD_ACTION"].SUPERADMIN = true;
  map["ADD_ACTION"].ADMIN = false;
  map["ADD_ACTION"].EXPERT = false;
  map["ADD_ACTION"].GUEST = false;
  map["ADD_ACTION"].USER = false;

  map["ADD_CONFIG_FLAG"].SUPERADMIN = true;
  map["ADD_CONFIG_FLAG"].ADMIN = false;
  map["ADD_CONFIG_FLAG"].EXPERT = false;
  map["ADD_CONFIG_FLAG"].GUEST = false;
  map["ADD_CONFIG_FLAG"].USER = false;

  return map;
};

/* ------------------------------------------------------------------ */

export function RoleManagement() {
  const [roles, setRoles] = useState<RoleDef[]>(INITIAL_ROLES);
  const [actions, setActions] = useState<ActionDef[]>(INITIAL_ACTIONS);
  const [matrix, setMatrix] =
    useState<Record<string, Record<RoleKey, boolean>>>(initialMatrix);

  const roleOrder = useMemo(() => roles.map((r) => r.key), [roles]);

  const togglePermission = (
    actionCode: string,
    role: RoleKey,
    next: boolean | "indeterminate"
  ) => {
    setMatrix((prev) => ({
      ...prev,
      [actionCode]: { ...prev[actionCode], [role]: next === true },
    }));
  };

  const onSave = () => {
    // TODO: Persist matrix + roles + actions
    // PATCH /roles/permissions { roles, actions, matrix }
    console.log("Saving permissions:", { roles, actions, matrix });
  };

  const addRole = () => {
    // TODO: open modal -> POST /roles
    const name = prompt("Role name (e.g., REVIEWER):");
    if (!name) return;
    const key = name.toUpperCase().replace(/\s+/g, "_") as RoleKey;
    // Type cast is for demo; in real code, validate & use server-provided id/key
    if (roles.some((r) => r.key === key)) return alert("Role already exists");
    const nextRoles = [...roles, { key, label: key }];
    setRoles(nextRoles);
    // Extend matrix with new column
    setMatrix((prev) => {
      const m: typeof prev = {};
      for (const a of actions) {
        m[a.code] = { ...(prev[a.code] || {}), [key]: false } as Record<
          RoleKey,
          boolean
        >;
      }
      return { ...prev, ...m };
    });
  };

  const addAction = () => {
    // TODO: open modal -> POST /permissions
    const name = prompt("Action code (e.g., DELETE_TOPIC):");
    if (!name) return;
    const code = name.toUpperCase().replace(/\s+/g, "_");
    if (actions.some((a) => a.code === code))
      return alert("Action already exists");
    const newAction = { code, label: code };
    setActions((prev) => [...prev, newAction]);
    setMatrix((prev) => ({
      ...prev,
      [code]: Object.fromEntries(roles.map((r) => [r.key, false])) as Record<
        RoleKey,
        boolean
      >,
    }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left nav */}
        <AppSidebar />

        {/* Center + Right rail */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Roles</h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={addAction}
                className="bg-rose-600 hover:bg-rose-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add action
              </Button>
              <Button
                onClick={addRole}
                className="bg-rose-500 hover:bg-rose-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </div>
          </header>

          {/* Middle area: center + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                <Card className="rounded-2xl">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left py-4 px-5 text-rose-600 font-semibold tracking-wide">
                              ACTIONS / ROLES
                            </th>
                            {roleOrder.map((rk) => (
                              <th
                                key={rk}
                                className="py-4 px-5 text-rose-600 font-semibold text-center"
                              >
                                <div className="inline-flex items-center gap-2">
                                  <span>{rk}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100">
                                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-44"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // TODO: open edit role modal
                                          console.log("Edit role", rk);
                                        }}
                                      >
                                        Edit role
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // TODO: duplicate role on server
                                          const dup = `${rk}_COPY` as RoleKey;
                                          if (roles.some((r) => r.key === dup))
                                            return;
                                          setRoles((prev) => [
                                            ...prev,
                                            { key: dup, label: dup },
                                          ]);
                                          setMatrix((prev) => {
                                            const m = { ...prev };
                                            for (const a of actions) {
                                              m[a.code] = {
                                                ...m[a.code],
                                                [dup]: m[a.code][rk as RoleKey],
                                              };
                                            }
                                            return m;
                                          });
                                        }}
                                      >
                                        Duplicate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // TODO: delete role server-side
                                          if (!confirm(`Remove role ${rk}?`))
                                            return;
                                          setRoles((prev) =>
                                            prev.filter((r) => r.key !== rk)
                                          );
                                          setMatrix((prev) => {
                                            const m: typeof prev = {};
                                            for (const a of actions) {
                                              const { [rk]: _, ...rest } =
                                                prev[a.code];
                                              m[a.code] = rest as Record<
                                                RoleKey,
                                                boolean
                                              >;
                                            }
                                            return m;
                                          });
                                        }}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {actions.map((a, idx) => (
                            <tr
                              key={a.code}
                              className={`border-t ${
                                idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                              }`}
                            >
                              {/* Left: action name + help + row menu */}
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold tracking-wide">
                                    {a.label}
                                  </span>
                                  {a.help && (
                                    <span title={a.help}>
                                      <Info className="h-4 w-4 text-slate-400" />
                                    </span>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100">
                                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="start"
                                      className="w-44"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // TODO: edit permission meta
                                          console.log("Edit action", a.code);
                                        }}
                                      >
                                        Edit action
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // TODO: delete permission server-side
                                          if (
                                            !confirm(`Remove action ${a.code}?`)
                                          )
                                            return;
                                          setActions((prev) =>
                                            prev.filter(
                                              (x) => x.code !== a.code
                                            )
                                          );
                                          setMatrix((prev) => {
                                            const {
                                              [a.code]: _removed,
                                              ...rest
                                            } = prev;
                                            return rest;
                                          });
                                        }}
                                      >
                                        Delete action
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>

                              {/* Columns: roles checkboxes */}
                              {roleOrder.map((rk) => (
                                <td
                                  key={`${a.code}-${rk}`}
                                  className="py-4 px-5 text-center"
                                >
                                  <Checkbox
                                    checked={!!matrix[a.code]?.[rk as RoleKey]}
                                    onCheckedChange={(v) =>
                                      togglePermission(a.code, rk as RoleKey, v)
                                    }
                                    className="data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer actions */}
                    <div className="flex justify-end p-5">
                      <Button
                        onClick={onSave}
                        className="bg-rose-600 hover:bg-rose-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* RIGHT RAIL */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default RoleManagement;
