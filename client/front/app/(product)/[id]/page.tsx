import React from 'react';
import Header from "@/components/modules/landing/Header";
import Footer from '@/components/modules/landing/Footer';
import ProductDetailClient from '@/components/modules/product/ProductDetailClient';
// Nextjs ISR caching strategy
export const revalidate = false;


interface PageProps{
    params: Promise < {
        id: string;
    }>;
}
export default async function Page( {params} : PageProps){
    const { id } = await params;
    return ( 
    <>
    <Header/>
    <ProductDetailClient productId={id} />
    <Footer/>

    </>
    );
}

// Nextjs dynamic metadata
export function generateMetadata() {
    return {
        title: `Page - Title here`,
        description: `Page - Description here`,
        icons: {
            icon: `path to asset file`,
        },
    };
}
