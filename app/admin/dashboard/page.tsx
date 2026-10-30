"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  size?: string;
  company_name?: string;
  company_website?: string;
  description?: string;
  sales_info?: string;
  features?: string[];
  images?: string[];
  source_platform?: string;
  source_url?: string;
  source_listing_id?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);

  // Add form
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    size: "",
    company_name: "",
    company_website: "",
    sales_info: "",
    features: "",
    source_platform: "",
    source_url: "",
    source_listing_id: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit
  const [editing, setEditing] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    size: "",
    company_name: "",
    company_website: "",
    sales_info: "",
    features: "",
    source_platform: "",
    source_url: "",
    source_listing_id: "",
  });
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const fetchProperties = useCallback(async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    setProperties(data || []);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) router.push("/admin/login");
      else {
        setLoading(false);
        fetchProperties();
      }
    };
    checkAuth();
  }, [router, fetchProperties]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/property-images/`;

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const fullUrl = uploadUrl + fileName;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", fullUrl, true);
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        xhr.timeout = 60000;
        xhr.ontimeout = () =>
          reject(new Error("Upload timed out – network too slow"));
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed with status ${xhr.status}`));
        };
        xhr.onerror = () =>
          reject(new Error("Network error – check your connection"));
        const formData = new FormData();
        formData.append("file", file);
        xhr.send(formData);
      });

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(fileName);
      urls.push(publicUrl);
    }
    return urls;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);

    let imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        imageUrls = await uploadImages(imageFiles);
      } catch (err: any) {
        const continueWithout = confirm(
          `Image upload failed: ${err.message}\n\nDo you want to post the property without images?`
        );
        if (!continueWithout) {
          setUploading(false);
          return;
        }
      }
    }

    const featuresArray = form.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const { error } = await supabase.from("properties").insert({
      title: form.title,
      description: form.description,
      price: form.price,
      location: form.location,
      size: form.size,
      company_name: form.company_name,
      company_website: form.company_website,
      sales_info: form.sales_info,
      features: featuresArray,
      images: imageUrls,
      source_platform: form.source_platform || null,
      source_url: form.source_url || null,
      source_listing_id: form.source_listing_id || null,
    });

    if (!error) {
      alert("Property posted!");
      setForm({
        title: "",
        description: "",
        price: "",
        location: "",
        size: "",
        company_name: "",
        company_website: "",
        sales_info: "",
        features: "",
        source_platform: "",
        source_url: "",
        source_listing_id: "",
      });
      setImageFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchProperties();
    } else {
      alert("Error: " + error.message);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (!error) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Error deleting property: " + error.message);
    }
  };

  const openEdit = (property: Property) => {
    setEditing(property);
    setEditForm({
      title: property.title || "",
      description: property.description || "",
      price: property.price || "",
      location: property.location || "",
      size: property.size || "",
      company_name: property.company_name || "",
      company_website: property.company_website || "",
      sales_info: property.sales_info || "",
      features: property.features?.join(", ") || "",
      source_platform: property.source_platform || "",
      source_url: property.source_url || "",
      source_listing_id: property.source_listing_id || "",
    });
    setEditImageFiles([]);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setUploading(true);
    setUploadProgress(0);

    let newImageUrls: string[] = [];
    if (editImageFiles.length > 0) {
      try {
        newImageUrls = await uploadImages(editImageFiles);
      } catch (err: any) {
        alert("Image upload failed: " + err.message);
        setUploading(false);
        return;
      }
    }

    const featuresArray = editForm.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const updateData: any = {
      title: editForm.title,
      description: editForm.description,
      price: editForm.price,
      location: editForm.location,
      size: editForm.size,
      company_name: editForm.company_name,
      company_website: editForm.company_website,
      sales_info: editForm.sales_info,
      features: featuresArray,
      source_platform: editForm.source_platform || null,
      source_url: editForm.source_url || null,
      source_listing_id: editForm.source_listing_id || null,
    };

    if (newImageUrls.length > 0) updateData.images = newImageUrls;

    const { error } = await supabase
      .from("properties")
      .update(updateData)
      .eq("id", editing.id);

    if (!error) {
      setEditing(null);
      fetchProperties();
      alert("Property updated!");
    } else {
      alert("Update error: " + error.message);
    }
    setUploading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* ADD FORM */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Add New Property</h1>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/admin/login");
              }}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Title *</label>
                <input name="title" required onChange={handleChange} value={form.title} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Price *</label>
                <input name="price" required onChange={handleChange} value={form.price} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Location *</label>
                <input name="location" required onChange={handleChange} value={form.location} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Size</label>
                <input name="size" onChange={handleChange} value={form.size} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Company Name</label>
                <input name="company_name" onChange={handleChange} value={form.company_name} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Company Website</label>
                <input name="company_website" onChange={handleChange} value={form.company_website} className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" rows={3} onChange={handleChange} value={form.description} className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Sales Info</label>
                <textarea name="sales_info" rows={2} onChange={handleChange} value={form.sales_info} className="w-full p-2 border rounded" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Features (comma separated)</label>
                <input name="features" onChange={handleChange} value={form.features} className="w-full p-2 border rounded" />
              </div>

              {/* Source fields */}
              <div className="col-span-2 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3">Source Attribution (optional)</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Fill these if the listing comes from another platform (e.g., PropertyPro, Nigeria Property Centre).
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Source Platform</label>
                <input
                  name="source_platform"
                  onChange={handleChange}
                  value={form.source_platform}
                  placeholder="e.g., PropertyPro.ng"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Source Listing ID</label>
                <input
                  name="source_listing_id"
                  onChange={handleChange}
                  value={form.source_listing_id}
                  placeholder="e.g., PP-12345"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium">Source URL</label>
                <input
                  name="source_url"
                  onChange={handleChange}
                  value={form.source_url}
                  placeholder="https://..."
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">Upload Images</label>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="w-full text-sm"
                />
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }} />
                    <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" disabled={uploading} className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
              {uploading ? "Posting..." : "Post Property"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">All Properties</h2>
          {properties.length === 0 && <p className="text-gray-500">No properties yet.</p>}
          <div className="space-y-3">
            {properties.map((property) => (
              <div key={property.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{property.title}</p>
                  <p className="text-sm text-gray-600">{property.location} – {property.price}</p>
                  {property.source_platform && (
                    <p className="text-xs text-gray-400">Source: {property.source_platform}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => openEdit(property)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(property.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Property</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Title *</label>
                  <input name="title" required value={editForm.title} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Price *</label>
                  <input name="price" required value={editForm.price} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Location *</label>
                  <input name="location" required value={editForm.location} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Size</label>
                  <input name="size" value={editForm.size} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Company Name</label>
                  <input name="company_name" value={editForm.company_name} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Company Website</label>
                  <input name="company_website" value={editForm.company_website} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Description</label>
                  <textarea name="description" rows={3} value={editForm.description} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Sales Info</label>
                  <textarea name="sales_info" rows={2} value={editForm.sales_info} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Features (comma separated)</label>
                  <input name="features" value={editForm.features} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>

                {/* Source fields */}
                <div className="col-span-2 pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-3">Source Attribution</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium">Source Platform</label>
                  <input name="source_platform" value={editForm.source_platform} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Source Listing ID</label>
                  <input name="source_listing_id" value={editForm.source_listing_id} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Source URL</label>
                  <input name="source_url" value={editForm.source_url} onChange={handleEditChange} className="w-full p-2 border rounded" />
                </div>

                {editing.images && editing.images.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium mb-1">Current Images</p>
                    <div className="flex flex-wrap gap-2">
                      {editing.images.map((url, i) => (
                        <img key={i} src={url} alt="" className="h-16 w-16 object-cover rounded border" />
                      ))}
                    </div>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Upload New Images (replaces all)</label>
                  <input type="file" multiple ref={editFileInputRef} onChange={(e) => setEditImageFiles(Array.from(e.target.files || []))} className="w-full text-sm" />
                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }} />
                      <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={uploading} className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
                  {uploading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}