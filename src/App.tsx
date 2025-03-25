import axios from "axios";
import  { useEffect, useState } from "react";

export default function App() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  
  const [viewFavorites, setViewFavorites] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const fetchImages = async () => {
    try {
      // placholder images not working for me so i use this api
      const res = await axios.get("https://picsum.photos/v2/list?page=1&limit=50");
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id :any) => {
    setFavorites((prev :any) =>
      prev.includes(id) ? prev.filter((fav :any ) => fav !== id) : [...prev, id]
    );
  };

  const filteredImages = images.filter((img:any) =>
    img.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by author..."
          className="p-2 border rounded-md w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-md"
          onClick={() => setViewFavorites(!viewFavorites)}
        >
          {viewFavorites ? "View All" : "View Favorites"}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {filteredImages
          .filter((img : any) => (viewFavorites ? favorites.includes(img.id) : true))
          .map((img : any) => (
            <div key={img.id} className="relative">
              <img
                src={img.download_url}
                alt={img.author}
                className="w-full h-32 object-cover cursor-pointer rounded-md"
                title={img.author}
                loading="lazy"
                onClick={() => setSelectedImage(img)}
              />
              <button
                className="absolute top-2 right-2 text-xl"
                onClick={() => toggleFavorite(img.id)}
              >
                {favorites.includes(img.id) ? "❤️" : "🤍"}
              </button>
            </div>
          ))}
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <button className="absolute top-2 right-2 text-2xl" onClick={() => setSelectedImage(null)}>✖</button>
            <img src={selectedImage.download_url} alt={selectedImage.author} className="max-w-3xl max-h-[80vh] rounded-md" />
            <p className="text-center mt-2">{selectedImage.author}</p>
          </div>
        </div>
      )}
    </div>
  );
}