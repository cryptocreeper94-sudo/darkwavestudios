import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, FileText, Plus, Save, Trash2, Edit3, Loader2, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { adminRequest, getAdminQueryOptions } from "@/lib/adminApi";

interface Document {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
}

const categories = [
  { value: "business", label: "Business Documents" },
  { value: "roadmap", label: "Roadmap" },
  { value: "legal", label: "Legal" },
];

export default function Documents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newDoc, setNewDoc] = useState({ slug: "", title: "", content: "", category: "business" });

  const { data, isLoading } = useQuery<{ documents: Document[] }>(
    getAdminQueryOptions(["/api/documents"])
  );

  const createDoc = useMutation({
    mutationFn: async () => {
      const response = await adminRequest("POST", "/api/documents", newDoc);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setIsCreating(false);
      setNewDoc({ slug: "", title: "", content: "", category: "business" });
      toast({ title: "Document created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateDoc = useMutation({
    mutationFn: async (doc: Document) => {
      await adminRequest("PATCH", `/api/documents/${doc.id}`, {
        title: doc.title,
        content: doc.content,
        category: doc.category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setEditingDoc(null);
      toast({ title: "Document updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteDoc = useMutation({
    mutationFn: async (id: string) => {
      await adminRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Document deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const groupedDocs = data?.documents?.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>) || {};

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="back-admin">
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FolderOpen className="w-8 h-8 text-primary" />
                Documents
              </h1>
              <p className="text-muted-foreground">Manage business documents, roadmap, and legal content</p>
            </div>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2" data-testid="create-document">
            <Plus className="w-4 h-4" />
            New Document
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-6 border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    placeholder="Document title"
                    data-testid="input-doc-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Slug (URL-friendly)</label>
                  <Input
                    value={newDoc.slug}
                    onChange={(e) => setNewDoc({ ...newDoc, slug: e.target.value })}
                    placeholder="document-slug"
                    data-testid="input-doc-slug"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full p-2 rounded-md border bg-background"
                  data-testid="select-doc-category"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  placeholder="Document content..."
                  rows={10}
                  data-testid="input-doc-content"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={() => createDoc.mutate()} disabled={createDoc.isPending} className="gap-2">
                  {createDoc.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save Document
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat.value}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {cat.label}
                </h2>
                {groupedDocs[cat.value]?.length ? (
                  <div className="grid gap-4">
                    {groupedDocs[cat.value].map((doc) => (
                      <Card key={doc.id} className="hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          {editingDoc?.id === doc.id ? (
                            <div className="space-y-4">
                              <Input
                                value={editingDoc.title}
                                onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                                className="font-semibold"
                              />
                              <Textarea
                                value={editingDoc.content}
                                onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                                rows={8}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setEditingDoc(null)}>Cancel</Button>
                                <Button onClick={() => updateDoc.mutate(editingDoc)} disabled={updateDoc.isPending}>
                                  {updateDoc.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{doc.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">/{doc.slug}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2">{doc.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Updated: {new Date(doc.updatedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingDoc(doc)}
                                  data-testid={`edit-doc-${doc.slug}`}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteDoc.mutate(doc.id)}
                                  className="text-destructive hover:text-destructive"
                                  data-testid={`delete-doc-${doc.slug}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No documents in this category yet.
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
