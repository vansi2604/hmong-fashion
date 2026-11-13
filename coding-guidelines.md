# HMONG Fashion - Coding Guidelines & Best Practices

> **Dự án**: HMONG Fashion (`hmong-fashion`)  
> **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Turbopack  
> **Mục tiêu**: Xây dựng nền tảng thương mại & quảng bá thời trang Hmong hiện đại với kiến trúc sạch, hiệu năng cao, chuẩn SEO, trải nghiệm mượt mà và dễ bảo trì mở rộng.

---

## 1. Nguyên tắc cốt lõi (Core Principles)

1. **Server-First by Default**:
   - Mặc định mọi component là **React Server Component (RSC)**.
   - Chỉ dùng `'use client'` khi bắt buộc cần interactivity (event listener, local state, browser API, client hook).
   - Đẩy client boundary xuống lá cây component (Leaf components) để tối thiểu hóa JS bundle gửi về trình duyệt.
2. **Type Safety tuyệt đối**:
   - Bật và tuân thủ `strict: true` trong TypeScript.
   - Tuyệt đối không dùng `any`. Ưu tiên `unknown` có type guard hoặc Zod schema validation.
3. **KISS & DRY (Keep It Simple & Don't Repeat Yourself)**:
   - Viết code ngắn gọn, tường minh, không over-engineering.
   - Tái sử dụng logic qua custom hooks hoặc utility functions; tái sử dụng UI qua primitive UI components.
4. **Mobile-First & Performance-First**:
   - Thiết kế và code responsive bắt đầu từ giao diện mobile (`375px+`), sau đó scale lên tablet/desktop (`md:`, `lg:`, `xl:`).
   - Tối ưu Core Web Vitals (LCP, INP, CLS) ngay từ giai đoạn phát triển.
5. **Văn hóa bản sắc kết hợp hiện đại**:
   - Màu sắc, typography, hoa văn trang phục Hmong phải được số hóa thành token design system nhất quán, tôn trọng giá trị văn hóa và giữ nét thanh lịch của thời trang cao cấp.

---

## 2. Cấu trúc thư mục chuẩn (Directory Structure)

Dự án áp dụng Next.js App Router với phân tách rõ ràng giữa Route, UI, Data, Logic và Types:

```text
hmong-fashion/
├── app/                           # Next.js App Router (Routes & Layouts)
│   ├── (shop)/                    # Route group cho luồng mua sắm (nếu cần)
│   │   ├── products/              # Trang danh sách sản phẩm (/products)
│   │   │   ├── [c]/            # Chi tiết sản phẩm (/products/[slug])
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── cart/                  # Giỏ hàng (/cart)
│   │   └── checkout/              # Thanh toán (/checkout)
│   ├── stories/                   # Câu chuyện văn hóa & Lookbook (/stories)
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Trang chủ (Home)
│   ├── not-found.tsx              # Trang 404
│   ├── error.tsx                  # Root error boundary
│   └── globals.css                # Tailwind v4 entry & theme definition
├── components/                    # Toàn bộ React Components
│   ├── ui/                        # Reusable primitives (Button, Modal, Input, Badge, Skeleton...)
│   ├── common/                    # Shared layout blocks (Navbar, Footer, MobileNav, Logo, Breadcrumbs)
│   ├── features/                  # Domain/Feature-specific components
│   │   ├── products/              # ProductCard, ProductGallery, ProductFilter, SizePicker
│   │   ├── cart/                  # CartDrawer, CartItemRow, CartSummary
│   │   └── stories/               # StoryHero, CraftProcess, CulturalGallery
│   └── icons/                     # Custom SVG / Brand icons (nếu có)
├── lib/                           # Utility functions, helpers & external clients
│   ├── utils.ts                   # Helper cn(), formatCurrency(), formatDate()
│   ├── constants.ts               # App constants, menu links, default metadata
│   └── mock-data.ts               # Dữ liệu mẫu (sản phẩm, câu chuyện)
├── types/                         # TypeScript interfaces & type definitions
│   ├── product.ts                 # Product, Category, Variant, Review
│   ├── cart.ts                    # CartItem, CartState
│   └── common.ts                  # Pagination, API response wrappers
├── actions/                       # Next.js Server Actions ('use server')
│   ├── cart.ts                    # Server actions cho giỏ hàng
│   └── newsletter.ts              # Đăng ký nhận tin
├── hooks/                         # Custom React client hooks
│   ├── use-cart.ts
│   └── use-media-query.ts
├── public/                        # Static assets (images, banners, icons, fonts)
│   ├── images/
│   │   ├── products/
│   │   ├── hero/
│   │   └── patterns/              # Hmong textile patterns / batik
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration (@/* alias)
└── eslint.config.mjs              # ESLint 9 Flat config
```

---

## 3. Quy chuẩn Next.js 16 & React 19

### 3.1. Server Components vs Client Components

* **Mặc định**: Mọi file trong `app/` và `components/` là **Server Component** trừ khi có lý do chính đáng để dùng Client Component.
* **Quy tắc phân định**:
  ```tsx
  // ❌ TRÁNH: Đánh dấu 'use client' ở toàn bộ trang
  'use client';
  export default function ProductDetailPage() { ... }

  // ✅ NÊN: Giữ page là Server Component, chỉ tách component tương tác nhỏ thành Client
  // app/products/[slug]/page.tsx (Server Component)
  import { ProductGallery } from '@/components/features/products/ProductGallery';
  import { AddToCartButton } from '@/components/features/products/AddToCartButton'; // 'use client'

  export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    return (
      <main className="container mx-auto px-4 py-8">
        <ProductGallery images={product.images} />
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <AddToCartButton product={product} />
      </main>
    );
  }
  ```
* **Lưu ý với Next.js 16 / React 19**:
  - `params` và `searchParams` trong Page/Layout là **`Promise`**, luôn cần `await params` hoặc dùng `use(params)`.
  - Hạn chế `useEffect` để fetch data; hãy fetch trực tiếp trên Server Component hoặc dùng Server Actions.

### 3.2. Data Fetching & Caching
* Gọi trực tiếp database / data layer bên trong Server Component.
* Sử dụng React `cache()` để memoize request trùng lặp trong một chu kỳ render:
  ```ts
  import { cache } from 'react';

  export const getProductBySlug = cache(async (slug: string) => {
    // Fetch từ DB hoặc CMS
    return db.product.findUnique({ where: { slug } });
  });
  ```
* Dùng **Server Actions** (`'use server'`) cho form submission và data mutation (thêm vào giỏ hàng, cập nhật thông tin).

### 3.3. Tối ưu Media & Metadata
* **Hình ảnh**: Luôn dùng `next/image` thay cho thẻ `<img>`.
  - Luôn chỉ định `alt` mang tính mô tả cao (hỗ trợ A11y và SEO hình ảnh).
  - Sử dụng `priority` cho hình ảnh Hero/LCP phía trên nếp gấp màn hình (above-the-fold).
  - Cung cấp `sizes` chính xác cho responsive image.
  ```tsx
  import Image from 'next/image';

  <Image
    src="/images/products/hmong-embroidered-jacket.jpg"
    alt="Áo khoác thổ cẩm Hmong họa tiết hoa văn sáp ong cách tân"
    width={600}
    height={800}
    className="object-cover w-full h-full rounded-2xl"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  ```
* **SEO Metadata**: Khai báo `metadata` rõ ràng cho từng trang hoặc sử dụng `generateMetadata()`:
  ```tsx
  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    return {
      title: `${product.name} | HMONG Fashion`,
      description: product.shortDescription,
      openGraph: {
        images: [product.thumbnail],
      },
    };
  }
  ```

---

## 4. Quy chuẩn TypeScript (Type Safety & Interfaces)

### 4.1. Quy tắc chung
- Tuyệt đối không dùng `any`. Khi chưa xác định rõ kiểu, dùng `unknown` và kiểm tra qua type narrowing / Zod.
- Sử dụng `interface` cho Object shapes / Entity models; sử dụng `type` cho Union, Tuple, Function signatures hoặc Utility types.
- Đặt file types tập trung tại `types/`, không khai báo tràn lan ở giữa component trừ khi type đó hoàn toàn mang tính cục bộ.

### 4.2. Khai báo Props cho Component
Mọi component nhận props phải khai báo interface rõ ràng, kèm comment nếu props phức tạp:

```tsx
// ✅ Chuẩn
export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badge?: string;
  category: string;
  onQuickView?: (id: string) => void;
  className?: string;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  badge,
  category,
  className,
}: ProductCardProps) {
  // ...
}
```

### 4.3. Import Path Aliases
Luôn dùng path alias `@/...` (được cấu hình trong `tsconfig.json`):
```tsx
// ✅ Chuẩn
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types/product';

// ❌ Tránh (deep relative imports)
import { Button } from '../../../components/ui/Button';
```

---

## 5. Quy chuẩn Tailwind CSS v4 & Thiết kế Giao diện

### 5.1. Cấu hình Tailwind v4 & Design Tokens
Dự án dùng cú pháp Tailwind CSS v4 (`@import "tailwindcss";`, `@theme inline`).  
Hệ thống token màu sắc và phong cách lấy cảm hứng từ trang phục truyền thống Hmong:
- **Chàm (Indigo/Navy)**: Tượng trưng cho vải nhuộm chàm truyền thống (`#1c2841`, `#2a3a5e`).
- **Thổ cẩm rực rỡ (Ethnic Accents)**: Đỏ son, cam đất, hồng cánh sen, xanh ngọc bích từ các đường thêu sáp ong và hoa văn.
- **Màu nền trung tính (Neutrals)**: Trắng kem vải lanh (`#faf8f5`), be ấm (`#f3eee7`), xám than (`#1f2421`).

Ví dụ định nghĩa token trong `app/globals.css`:
```css
@import "tailwindcss";

:root {
  --background: #faf8f5;
  --foreground: #1e1e1e;
  --hmong-indigo: #1b263b;
  --hmong-indigo-light: #2c3e55;
  --hmong-crimson: #c83e4d;
  --hmong-gold: #d4a373;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-indigo-hmong: var(--hmong-indigo);
  --color-crimson-hmong: var(--hmong-crimson);
  --color-gold-hmong: var(--hmong-gold);
}
```

### 5.2. Thứ tự Utility Classes (Class Ordering)
Sắp xếp class có hệ thống theo thứ tự:
1. **Layout & Positioning**: `relative`, `absolute`, `flex`, `grid`, `items-center`, `justify-between`
2. **Box Model & Spacing**: `w-full`, `max-w-md`, `h-auto`, `p-4`, `mx-auto`, `gap-3`
3. **Typography**: `font-sans`, `text-lg`, `font-semibold`, `text-neutral-900`
4. **Visuals & Backgrounds**: `bg-white`, `border`, `rounded-xl`, `shadow-sm`
5. **Interactive & Transitions**: `hover:scale-105`, `transition-all`, `duration-200`, `focus-visible:ring-2`

### 5.3. Sử dụng hàm kết hợp class `cn()`
Dùng `clsx` và `tailwind-merge` thông qua hàm tiện ích `cn()` ở `@/lib/utils` để ghép class điều kiện:
```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Ví dụ sử dụng:
```tsx
<button
  className={cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-colors",
    "px-6 py-2.5 text-sm",
    variant === "primary" && "bg-neutral-900 text-white hover:bg-neutral-800",
    variant === "outline" && "border border-neutral-300 text-neutral-800 hover:bg-neutral-50",
    disabled && "opacity-50 cursor-not-allowed",
    className
  )}
>
  {children}
</button>
```

---

## 6. Quản lý trạng thái & Xử lý Dữ liệu

| Dạng dữ liệu / State | Giải pháp khuyến nghị | Ví dụ |
| :--- | :--- | :--- |
| **Server State** | Server Components + Fetch Cache | Danh sách sản phẩm, chi tiết bài viết, lookbook |
| **URL State** | Query Params (`useSearchParams`, `nuqs`) | Bộ lọc danh mục, sắp xếp giá, phân trang (`?category=ao-khoac&sort=price_asc`) |
| **Local UI State** | `useState`, `useReducer` | Trạng thái mở menu dropdown, bật tắt modal ảnh phóng to |
| **Global Client State** | React Context hoặc Zustand nhẹ | Giỏ hàng tạm thời (Cart drawer), wishlist client |
| **Form & Mutation** | React 19 `useActionState` + Server Actions | Thêm sản phẩm vào giỏ, gửi liên hệ đặt may đo |

---

## 7. Quy chuẩn đặt tên (Naming Conventions)

### 7.1. Thư mục & Tệp tin (Files & Folders)
- **Component files**: `PascalCase.tsx` (e.g. `ProductCard.tsx`, `Navbar.tsx`, `CartDrawer.tsx`).
- **Pages & App Router files**: Theo quy ước Next.js: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- **Route directory**: `kebab-case` (e.g. `app/cultural-stories/`, `app/custom-tailoring/`).
- **Hook files**: `camelCase.ts` có tiền tố `use-` (e.g. `use-cart.ts`, `use-window-scroll.ts`).
- **Utility / Config / Types**: `kebab-case.ts` hoặc `camelCase.ts` (e.g. `format-currency.ts`, `product.ts`).

### 7.2. Biến, Hàm & Kiểu dữ liệu trong Code
- **Biến & Hàm thông thường**: `camelCase` (e.g. `formattedPrice`, `calculateTotal()`, `fetchProducts()`).
- **Biến Boolean**: Luôn có tiền tố ngữ nghĩa `is`, `has`, `can`, `should`:
  ```ts
  const isLoading = false;
  const hasDiscount = product.discountPercent > 0;
  const isAvailable = product.stockQuantity > 0;
  ```
- **Interface & Types**: `PascalCase` (e.g. `Product`, `CartItem`, `UserAddress`).
- **Hằng số (Constants)**: `UPPER_SNAKE_CASE` (e.g. `DEFAULT_PAGE_SIZE`, `MAX_CART_ITEMS`).

---

## 8. Xử lý lỗi, Form & Trải nghiệm người dùng (UX)

### 8.1. Loading & Skeleton UI
- Mọi trang có data fetching bất đồng bộ phải có file `loading.tsx` tương ứng.
- Ưu tiên dùng **Skeleton Loader** mô phỏng đúng bố cục trang thay vì hiển thị spinner đơn điệu, giúp giao diện không bị giật layout (tránh Cumulative Layout Shift - CLS).

### 8.2. Error Handling & Boundary
- Luôn cung cấp `error.tsx` kèm nút phục hồi ("Thử lại" / "Tải lại trang") và fallback UI thân thiện với người dùng Việt Nam.
- Không để lộ lỗi kỹ thuật (stack trace, unhandled promise) lên giao diện người dùng.

### 8.3. Format Tiền tệ & Ngôn ngữ
- Sử dụng hàm chuẩn hoá tiền tệ VNĐ và ngày tháng Việt Nam thống nhất:
  ```ts
  // lib/utils.ts
  export function formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }
  ```

---

## 9. Khả năng truy cập (Accessibility - A11y) & SEO

1. **Semantic HTML**:
   - Sử dụng thẻ ngữ nghĩa: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<aside>`.
   - Nút bấm có hành động click phải dùng thẻ `<button>`, liên kết chuyển trang phải dùng thẻ `Link` của `next/link`. Không dùng thẻ `<div>` gán `onClick`.
2. **Hỗ trợ Screen Reader**:
   - Mọi nút bấm chỉ có icon (như nút Đóng Modal, nút Tìm kiếm, nút Giỏ hàng) phải có `aria-label`:
     ```tsx
     <button aria-label="Mở giỏ hàng" onClick={openCart}>
       <CartIcon className="w-6 h-6" />
     </button>
     ```
3. **Keyboard Navigation**:
   - Đảm bảo có thể duyệt website hoàn toàn bằng phím `Tab`, `Enter`, `Escape`.
   - Có style rõ ràng cho `:focus-visible` (ví dụ `focus-visible:ring-2 focus-visible:ring-offset-2`).

---

## 10. Quy trình Git & Commit Checklist

### 10.1. Chuẩn hóa Commit Message (Conventional Commits)
Áp dụng cú pháp: `type(scope): description`

- `feat`: Tính năng mới (ví dụ: `feat(product): thêm bộ lọc danh mục và khoảng giá`)
- `fix`: Sửa lỗi (ví dụ: `fix(cart): sửa lỗi tính sai tổng tiền khi áp mã giảm giá`)
- `style`: Thay đổi giao diện, CSS, layout (ví dụ: `style(navbar): điều chỉnh khoảng cách menu mobile`)
- `refactor`: Tái cấu trúc code mà không đổi tính năng (ví dụ: `refactor(lib): tối ưu hàm format tiền tệ`)
- `perf`: Tối ưu hiệu năng (ví dụ: `perf(images): thêm blur placeholder cho hero banner`)
- `docs`: Cập nhật tài liệu (ví dụ: `docs: bổ sung coding-guidelines.md`)
- `chore`: Cập nhật cấu hình, dependencies, script build (ví dụ: `chore: nâng cấp eslint rule`)

### 10.2. Checklist trước khi tạo Pull Request / Merge
- [ ] Chạy `npm run lint` không còn lỗi hay cảnh báo nào.
- [ ] Chạy `npm run build` thành công, không phát sinh lỗi type checking hay compile error.
- [ ] Kiểm tra responsive trên cả màn hình Mobile (`375px`), Tablet (`768px`) và Desktop (`1280px+`).
- [ ] Mọi hình ảnh mới đều được tối ưu qua `next/image` và có thuộc tính `alt`.
- [ ] Đã dọn dẹp các lệnh `console.log` và code chú thích (commented code) không cần thiết.

---

*Tài liệu này là quy chuẩn chung áp dụng cho toàn bộ dự án HMONG Fashion. Mọi thành viên đóng góp code cần đọc kỹ và tuân thủ.*
