import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import { supabase } from '../lib/supabase';

// Configure FCL for testnet
fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("flow.network", "testnet")
  .put("app.detail.title", "Title Storage Demo")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")
  .put("walletConnect.projectId", "26eb8fb8f9c43991c5b5d0c1c5e87fe7");

interface Title {
  id: number;
  title: string;
}

interface ProjectDetails {
  description: string;
  founder_name: string;
  company_name: string;
  category: string;
  project_type: string;
  business_model: string;
  project_summary: string;
  developers: string;
  demo_link: string;
  presentation_video: string;
  github_repo: string;
}

export default function IPRegistration() {
  const [title, setTitle] = useState("");
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    description: "",
    founder_name: "",
    company_name: "",
    category: "",
    project_type: "",
    business_model: "",
    project_summary: "",
    developers: "",
    demo_link: "",
    presentation_video: "",
    github_repo: ""
  });

  // Handle image upload to Supabase Storage
  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Fetch all titles
  const fetchTitles = async () => {
    try {
      const result = await fcl.query({
        cadence: `
          import Counter from 0xd0963316d56da678

          access(all) fun main(): Int {
            return Counter.count
          }
        `
      });

      // Create a single title entry with the counter value
      setTitles([{
        id: result,
        title: title || "Counter value"
      }]);
    } catch (error) {
      console.error("Error fetching counter:", error);
    }
  };

  // Store title on Flow and details in Supabase
  const storeTitle = async () => {
    try {
      setLoading(true);
      
      // Get user's Flow address
      const user = await fcl.currentUser.snapshot();
      if (!user.addr) {
        throw new Error("Please connect your Flow wallet first");
      }

      // Upload image if selected
      let uploadedImageUrl = null;
      if (image) {
        uploadedImageUrl = await uploadImage(image);
      }

      // First store on Flow
      const transactionId = await fcl.mutate({
        cadence: `
          import Counter from 0xd0963316d56da678
          
          transaction(title: String) {
            prepare(acct: auth(BorrowValue) &Account) {}
            
            execute {
              Counter.increment()
            }
          }
        `,
        args: (arg: any, t: any) => [arg(title, t.String)],
        limit: 9999
      });

      console.log("Flow Transaction ID:", transactionId);
      
      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log("Flow Transaction sealed:", transaction);

      // Then store in Supabase
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        throw new Error("User not authenticated");
      }

      // Generate temporary IPFS data (replace with actual IPFS upload later)
      const tempIpfsHash = "QmTemp" + Math.random().toString(36).substring(7);
      const tempIpfsUrl = `https://ipfs.io/ipfs/${tempIpfsHash}`;

      const { error } = await supabase
        .from('ip_registrations')
        .insert([
          {
            user_id: authUser.user.id,
            title: title,
            wallet_address: user.addr,
            ipfs_hash: tempIpfsHash,
            ipfs_url: tempIpfsUrl,
            image_url: uploadedImageUrl,
            thumbnail_url: uploadedImageUrl,
            ...projectDetails,
            status: 'approved'
          }
        ]);

      if (error) throw error;
      console.log("Stored in Supabase successfully");
      
      // Reset form
      setTitle("");
      setImage(null);
      setImageUrl(null);
      setProjectDetails({
        description: "",
        founder_name: "",
        company_name: "",
        category: "",
        project_type: "",
        business_model: "",
        project_summary: "",
        developers: "",
        demo_link: "",
        presentation_video: "",
        github_repo: ""
      });
      
      fetchTitles(); // Refresh the list
    } catch (error) {
      console.error("Error storing title:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Title</h1>
      
      <div className="mb-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={projectDetails.description}
              onChange={handleInputChange}
              placeholder="Detailed project description"
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founder Name</label>
              <input
                type="text"
                name="founder_name"
                value={projectDetails.founder_name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={projectDetails.company_name}
                onChange={handleInputChange}
                placeholder="Company name"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={projectDetails.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select category</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Fintech">Fintech</option>
                <option value="Healthtech">Healthtech</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <input
                type="text"
                name="project_type"
                value={projectDetails.project_type}
                onChange={handleInputChange}
                placeholder="e.g., Web App, Mobile App"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Model</label>
            <input
              type="text"
              name="business_model"
              value={projectDetails.business_model}
              onChange={handleInputChange}
              placeholder="Your business model"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Summary</label>
            <textarea
              name="project_summary"
              value={projectDetails.project_summary}
              onChange={handleInputChange}
              placeholder="Brief elevator pitch"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
            <input
              type="text"
              name="developers"
              value={projectDetails.developers}
              onChange={handleInputChange}
              placeholder="Team members and their roles"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Demo Link</label>
              <input
                type="url"
                name="demo_link"
                value={projectDetails.demo_link}
                onChange={handleInputChange}
                placeholder="Link to working demo"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository</label>
              <input
                type="url"
                name="github_repo"
                value={projectDetails.github_repo}
                onChange={handleInputChange}
                placeholder="GitHub repository link"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Presentation Video</label>
            <input
              type="url"
              name="presentation_video"
              value={projectDetails.presentation_video}
              onChange={handleInputChange}
              placeholder="Link to presentation video"
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={storeTitle}
            disabled={loading}
            className={`w-full p-3 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Storing...' : 'Store Title'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Stored Titles</h2>
        <ul className="space-y-2">
          {titles.map((item) => (
            <li key={item.id} className="p-3 bg-gray-50 rounded">
              <span className="font-medium">#{item.id}:</span> {item.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}