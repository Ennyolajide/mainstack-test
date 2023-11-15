import { Schema, model, Document } from 'mongoose';

// Define the product schema
interface Product extends Document {
  name: string;
  price: number;
  imageUrl: string; // New field for storing the image URL
}

const productSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'default-image-url.jpg', // Provide a default image URL if needed
  },
});

// Create the Product model
const Product = model<Product>('Product', productSchema);

export default Product;
