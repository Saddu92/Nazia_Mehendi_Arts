import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

async function createAdmin() {
  try {
    // Validate environment variables
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
      );
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error("Admin password must be at least 8 characters");
    }

    // Connect to MongoDB Atlas
    await connectDB();

    const email = ADMIN_EMAIL.toLowerCase().trim();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists with this email.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin
    const admin = await Admin.create({
      name: ADMIN_NAME.trim(),
      email,
      password: hashedPassword,
    });

    console.log("Admin created successfully!");
    console.log(`Admin ID: ${admin._id}`);
    console.log(`Admin Email: ${admin.email}`);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();