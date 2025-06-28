const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema (same as in your backend)
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'mentor', 'staff'],
    default: 'student'
  },
  isEmailVerified: {
    type: Boolean,
    default: true // Set to true for admin users
  },
  isActive: {
    type: Boolean,
    default: true
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  currentCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' }
    }
  },
  lastLogin: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  passwordResetToken: String,
  passwordResetExpire: Date
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ studentId: 1 });

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate student ID
userSchema.pre('save', async function(next) {
  if (this.isNew && this.role === 'student' && !this.studentId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({ role: 'student' });
    this.studentId = `VS${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpire;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpire;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

// Admin users data
const adminUsers = [
  {
    firstName: 'Sasanka',
    lastName: 'Sekhar',
    email: 'sasankasekharkundu24@gmail.com',
    phone: '1234567890',
    password: 'Panda2008',
    role: 'admin',
    isEmailVerified: true,
    isActive: true
  },
  {
    firstName: 'Vivek',
    lastName: 'Gupta',
    email: 'vivekgupta9053@hotmail.com',
    phone: '1234567891',
    password: 'V@v797943',
    role: 'admin',
    isEmailVerified: true,
    isActive: true
  },
  {
    firstName: 'Vidhyarthi',
    lastName: 'Seva',
    email: 'vidhyarthiseva7@gmail.com',
    phone: '1234567892',
    password: 'V@v797943',
    role: 'admin',
    isEmailVerified: true,
    isActive: true
  }
];

async function createAdminUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin users already exist
    for (const adminData of adminUsers) {
      const existingUser = await User.findOne({ email: adminData.email });
      
      if (existingUser) {
        console.log(`⚠️  Admin user ${adminData.email} already exists`);
        continue;
      }

      // Create new admin user
      const adminUser = new User(adminData);
      await adminUser.save();
      
      console.log(`✅ Created admin user: ${adminData.email}`);
    }

    console.log('\n🎉 Admin users setup completed!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log('');
    });

    console.log('🔐 You can now login to the admin dashboard with these credentials!');

  } catch (error) {
    console.error('❌ Error creating admin users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createAdminUsers(); 