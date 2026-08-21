export function generateSEO({

    title,
    description,
    keywords=[]
    
    }:{
    title:string;
    description:string;
    keywords?:string[];
    
    }){
    
    
    return {
    
    title,
    
    description,
    
    keywords,
    
    
    openGraph:{
    title,
    description
    },
    
    
    twitter:{
    card:"summary_large_image",
    title,
    description
    }
    
    }
    
    
    }