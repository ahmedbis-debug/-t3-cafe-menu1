import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";

const categories = {
  hot: { nameEn: "Hot Drinks", nameAr: "مشروبات حارة", icon: "☕" },
  cold: { nameEn: "Cold Drinks", nameAr: "مشروبات باردة", icon: "🧊" },
  desserts: { nameEn: "Desserts", nameAr: "الحلويات", icon: "🍰" },
  meals: { nameEn: "Light Meals", nameAr: "وجبات خفيفة", icon: "🥪" },
};

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState("ar");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products
  const { data: allProducts = [], isLoading: loadingProducts } = trpc.products.list.useQuery();

  // Get products for selected category
  const categoryProducts = selectedCategory
    ? allProducts.filter((p) => p.category === selectedCategory)
    : allProducts;

  // Filter by search
  const filteredProducts = categoryProducts.filter((p) => {
    const query = searchQuery.toLowerCase();
    return p.nameEn.toLowerCase().includes(query) || p.nameAr.toLowerCase().includes(query);
  });

  const isRtl = currentLanguage === "ar";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50" dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.5) 100%), url('https://private-us-east-1.manuscdn.com/sessionFile/Q6kIOQLzFhdaecf8I3EW3l/sandbox/VJOp5N7Lr6937FmxnGgjoI-img-1_1770595369000_na1fn_Y2FmZS1oZXJvLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUTZrSU9RTHpGaGRhZWNmOEkzRVczbC9zYW5kYm94L1ZKT3A1TjdMcjY5MzdGbXhuR2dqb0ktaW1nLTFfMTc3MDU5NTM2OTAwMF9uYTFmbl9ZMkZtWlMxb1pYSnZMV0puLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=j0Ll4AfjYXoP4GYIiwEAN8Q2eenP6qG5CXUC1DoH2XYDJ4T8wj7vrG7vaObaS2iY3BWjL8~JOv8hXd9~wZXIgAqpyrL2UwoGxOgDpxd5ZxHbdn440M6BscMK34HaIh8vNvjAbYemVqtO2P8joRRBFj~lGD1EU9DYZ18Qwq~B5n4jknr2d3Sb~ZVR5WQlJgYCmg8jIPf6A4aV2XO4xsdNwZHwZDvpvL1hD99acyIgaLLA5mb0-LIp6oXm514UlabO4Ny7s20hsee~rYn61953XMh6262jJzW8rKDDqXpkqSEXJ3sV3PwzYN6SiKC~1qK41PmbO3vRTnLtWzcbSelHmw__')`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            T/3 Coffee
          </h1>
          <p className="text-xl">Artisanal Coffee & Culinary Delights</p>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4 items-center justify-between flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder={isRtl ? "ابحث عن منتج..." : "Search menu..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-full focus:outline-none focus:border-amber-600"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentLanguage(isRtl ? "en" : "ar")}
            className="border-amber-600 text-amber-600 hover:bg-amber-50"
          >
            {isRtl ? "English" : "العربية"}
          </Button>
          {isAuthenticated && (
            <Button
              variant="ghost"
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              {isRtl ? "تسجيل الخروج" : "Logout"}
            </Button>
          )}
          {!isAuthenticated && (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isRtl ? "تسجيل الدخول" : "Login"}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Selection */}
        {!selectedCategory && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isRtl ? "اختر الفئة" : "Select Category"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(categories).map(([key, cat]) => (
                <Card
                  key={key}
                  className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-2"
                  onClick={() => setSelectedCategory(key)}
                >
                  <div className="p-6 text-center">
                    <div className="text-5xl mb-4">{cat.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {isRtl ? cat.nameAr : cat.nameEn}
                    </h3>
                    <p className="text-gray-500 mt-2">
                      {allProducts.filter((p) => p.category === key).length} items
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {selectedCategory && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="border-amber-600 text-amber-600"
              >
                ← {isRtl ? "العودة" : "Back"}
              </Button>
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {isRtl ? categories[selectedCategory as keyof typeof categories]?.nameAr : categories[selectedCategory as keyof typeof categories]?.nameEn}
              </h2>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-amber-600" size={40} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {isRtl ? "لا توجد منتجات" : "No products found"}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.nameEn}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {categories[product.category as keyof typeof categories]?.icon}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{product.nameEn}</h3>
                      <p className="text-sm text-gray-600 mb-3">{product.nameAr}</p>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-amber-600">{product.price} SR</p>
                          {(product.calories ?? 0) > 0 && (
                            <p className="text-xs text-gray-500">🔥 {product.calories} cal</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Panel Link */}
        {user?.role === "admin" && (
          <div className="mt-12 text-center">
            <Button
              onClick={() => (window.location.href = "/admin")}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isRtl ? "لوحة التحكم" : "Admin Panel"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
