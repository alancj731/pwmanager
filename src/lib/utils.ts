'use client'

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast, TypeOptions, Slide } from 'react-toastify';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const showToast = (message: string, type: TypeOptions = 'info') => {
  toast(message, {
    position: "top-center",   
    autoClose: 3000,         
    type,                   
    theme: "dark",          
    hideProgressBar : true,
    transition: Slide,
    style: {
      backgroundColor: 'gray', 
      color: 'white',
      fontSize: '12px',         
      borderRadius: '5px',     
      padding: '5px',          
    }
  })
};

export function copyToClipboard(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}
