import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAuth } from '@/contexts/useAdminAuth';
import { adminRequest, stripSystemFields } from '@/lib/strapi/adminClient';

type StrapiListResponse<T> = { data: T[] };
type StrapiSingleResponse<T> = { data: T };

type ResourceConfig =
  | {
      kind: 'single';
      key: string;
      title: string;
      endpoint: string;
    }
  | {
      kind: 'collection';
      key: string;
      title: string;
      endpoint: string;
      labelKeys: string[];
    };

const RESOURCES: ResourceConfig[] = [
  { kind: 'single', key: 'site-setting', title: 'Site Settings', endpoint: '/site-setting' },
  { kind: 'collection', key: 'services', title: 'Services', endpoint: '/services', labelKeys: ['title', 'slug'] },
  { kind: 'collection', key: 'project-categories', title: 'Project Categories', endpoint: '/project-categories', labelKeys: ['title', 'slug'] },
  { kind: 'collection', key: 'projects', title: 'Projects', endpoint: '/projects', labelKeys: ['title', 'slug'] },
  { kind: 'collection', key: 'process-steps', title: 'Process Steps', endpoint: '/process-steps', labelKeys: ['title', 'stepNumber'] },
];

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function parseJson(text: string): unknown {
  return JSON.parse(text);
}

function getLabel(item: Record<string, unknown>, labelKeys: string[]): string {
  for (const key of labelKeys) {
    const val = item[key];
    if (typeof val === 'string' && val.trim()) return val;
    if (typeof val === 'number') return String(val);
  }
  if (typeof item.id === 'number') return `#${item.id}`;
  return 'Item';
}

const AdminDashboard: React.FC = () => {
  const { token, user, logout } = useAdminAuth();
  const queryClient = useQueryClient();

  const [active, setActive] = useState<string>(RESOURCES[0].key);

  const resource = useMemo(() => RESOURCES.find(r => r.key === active)!, [active]);

  // Collection state
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedJson, setSelectedJson] = useState('');
  const [createJson, setCreateJson] = useState('{}');

  // Single state
  const [singleJson, setSingleJson] = useState('');

  useEffect(() => {
    setSelectedId(null);
    setSelectedJson('');
    setCreateJson('{}');
    setSingleJson('');
  }, [active]);

  const populate = { populate: '*' } as const;

  const singleQuery = useQuery({
    queryKey: ['admin', resource.key, 'single'],
    enabled: resource.kind === 'single',
    queryFn: async () => {
      const res = await adminRequest<StrapiSingleResponse<Record<string, unknown>>>(resource.endpoint, {
        token: token!,
        method: 'GET',
        params: populate,
      });
      return res.data;
    },
  });

  const collectionQuery = useQuery({
    queryKey: ['admin', resource.key, 'list'],
    enabled: resource.kind === 'collection',
    queryFn: async () => {
      const res = await adminRequest<StrapiListResponse<Record<string, unknown>>>(resource.endpoint, {
        token: token!,
        method: 'GET',
        params: populate,
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (resource.kind === 'single' && singleQuery.data) {
      setSingleJson(pretty(singleQuery.data));
    }
  }, [resource.kind, singleQuery.data]);

  useEffect(() => {
    if (resource.kind !== 'collection') return;
    if (!collectionQuery.data || collectionQuery.data.length === 0) return;
    if (selectedId !== null) return;

    const first = collectionQuery.data.find(x => typeof x.id === 'number');
    if (first && typeof first.id === 'number') {
      setSelectedId(first.id);
      setSelectedJson(pretty(first));
    }
  }, [resource.kind, collectionQuery.data, selectedId]);

  const updateSingle = useMutation({
    mutationFn: async () => {
      const parsed = parseJson(singleJson) as Record<string, unknown>;
      const data = stripSystemFields(parsed);
      return adminRequest(resource.endpoint, {
        token: token!,
        method: 'PUT',
        body: { data },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', resource.key, 'single'] });
    },
  });

  const createItem = useMutation({
    mutationFn: async () => {
      const parsed = parseJson(createJson) as Record<string, unknown>;
      const data = stripSystemFields(parsed);
      return adminRequest(resource.endpoint, {
        token: token!,
        method: 'POST',
        body: { data },
      });
    },
    onSuccess: async () => {
      setCreateJson('{}');
      await queryClient.invalidateQueries({ queryKey: ['admin', resource.key, 'list'] });
    },
  });

  const updateItem = useMutation({
    mutationFn: async () => {
      if (!selectedId) throw new Error('No item selected');
      const parsed = parseJson(selectedJson) as Record<string, unknown>;
      const data = stripSystemFields(parsed);
      return adminRequest(`${resource.endpoint}/${selectedId}`, {
        token: token!,
        method: 'PUT',
        body: { data },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', resource.key, 'list'] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async () => {
      if (!selectedId) throw new Error('No item selected');
      return adminRequest(`${resource.endpoint}/${selectedId}`, {
        token: token!,
        method: 'DELETE',
      });
    },
    onSuccess: async () => {
      setSelectedId(null);
      setSelectedJson('');
      await queryClient.invalidateQueries({ queryKey: ['admin', resource.key, 'list'] });
    },
  });

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Admin</h1>
            <p className="text-sm text-muted-foreground">
              {user?.email ? `Signed in as ${String(user.email)}` : 'Signed in'}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>

        <Tabs value={active} onValueChange={setActive} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-2">
            {RESOURCES.map(r => (
              <TabsTrigger key={r.key} value={r.key}>
                {r.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {RESOURCES.map(r => (
            <TabsContent key={r.key} value={r.key} className="mt-4">
              {r.kind === 'single' ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{r.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', r.key, 'single'] })}
                      >
                        Refresh
                      </Button>
                      <Button
                        onClick={() => updateSingle.mutate()}
                        disabled={updateSingle.isPending}
                      >
                        {updateSingle.isPending ? 'Saving…' : 'Save'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {singleQuery.isLoading ? (
                      <div className="text-sm text-muted-foreground">Loading…</div>
                    ) : singleQuery.error ? (
                      <div className="text-sm text-destructive">{singleQuery.error instanceof Error ? singleQuery.error.message : String(singleQuery.error)}</div>
                    ) : (
                      <Textarea
                        value={singleJson}
                        onChange={(e) => setSingleJson(e.target.value)}
                        className="min-h-[420px] font-mono text-xs"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Tip: edit JSON and click Save. System fields are ignored on save.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="md:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{r.title}</CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['admin', r.key, 'list'] })}
                      >
                        Refresh
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {collectionQuery.isLoading ? (
                        <div className="text-sm text-muted-foreground">Loading…</div>
                      ) : collectionQuery.error ? (
                        <div className="text-sm text-destructive">{collectionQuery.error instanceof Error ? collectionQuery.error.message : String(collectionQuery.error)}</div>
                      ) : (
                        <div className="space-y-2">
                          {(collectionQuery.data || []).map((item) => {
                            const id = item.id as number | undefined;
                            if (typeof id !== 'number') return null;
                            const label = getLabel(item, r.labelKeys);
                            const activeRow = selectedId === id;
                            return (
                              <button
                                key={id}
                                className={`w-full text-left rounded-md border px-3 py-2 text-sm transition-colors ${activeRow ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'}`}
                                onClick={() => {
                                  setSelectedId(id);
                                  setSelectedJson(pretty(item));
                                }}
                              >
                                <div className="font-medium">{label}</div>
                                <div className="text-xs text-muted-foreground">ID: {id}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Edit</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateItem.mutate()}
                          disabled={!selectedId || updateItem.isPending}
                        >
                          {updateItem.isPending ? 'Saving…' : 'Save'}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (!selectedId) return;
                            if (window.confirm('Delete this item?')) deleteItem.mutate();
                          }}
                          disabled={!selectedId || deleteItem.isPending}
                        >
                          {deleteItem.isPending ? 'Deleting…' : 'Delete'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        value={selectedJson}
                        onChange={(e) => setSelectedJson(e.target.value)}
                        className="min-h-[320px] font-mono text-xs"
                        placeholder="Select an item from the list"
                      />
                      <p className="text-xs text-muted-foreground">
                        Save sends a PUT to this item using its numeric ID.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Create New</CardTitle>
                      <Button
                        onClick={() => createItem.mutate()}
                        disabled={createItem.isPending}
                      >
                        {createItem.isPending ? 'Creating…' : 'Create'}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        value={createJson}
                        onChange={(e) => setCreateJson(e.target.value)}
                        className="min-h-[220px] font-mono text-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        Create sends a POST with {`{ data: { ... } }`}. System fields are ignored.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <p className="text-xs text-muted-foreground">
          Security note: token is stored in sessionStorage and expires based on JWT exp.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
