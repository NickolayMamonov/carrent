CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'USER');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Create Users table
CREATE TABLE "User"
(
    id                     TEXT PRIMARY KEY,
    email                  TEXT UNIQUE              NOT NULL,
    password               TEXT                     NOT NULL,
    role                   "UserRole"               NOT NULL DEFAULT 'USER',
    "firstName"            TEXT                     NOT NULL,
    "lastName"             TEXT                     NOT NULL,
    "isVerified"           BOOLEAN                  NOT NULL DEFAULT false,
    "verificationToken"    TEXT UNIQUE,
    "resetPasswordToken"   TEXT UNIQUE,
    "resetPasswordExpires" TIMESTAMP WITH TIME ZONE,
    "lastLogin"            TIMESTAMP WITH TIME ZONE,
    "createdAt"            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create RefreshToken table
CREATE TABLE "RefreshToken"
(
    id          TEXT PRIMARY KEY,
    token       TEXT UNIQUE              NOT NULL,
    "userId"    TEXT                     NOT NULL REFERENCES "User" (id) ON DELETE CASCADE,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create DrivingLicense table
CREATE TABLE "DrivingLicense"
(
    id           TEXT PRIMARY KEY,
    number       TEXT UNIQUE              NOT NULL,
    "issueDate"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "expiryDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "userId"     TEXT                     NOT NULL UNIQUE REFERENCES "User" (id) ON DELETE CASCADE
);

-- Create Car table
CREATE TABLE "Car"
(
    id               TEXT PRIMARY KEY,
    make             TEXT                     NOT NULL,
    model            TEXT                     NOT NULL,
    year             INTEGER                  NOT NULL,
    "pricePerDay"    DECIMAL(10, 2)           NOT NULL,
    type             TEXT                     NOT NULL,
    images           TEXT[] NOT NULL,
    features         TEXT[] NOT NULL,
    availability     BOOLEAN                  NOT NULL DEFAULT true,
    description      TEXT,
    "createdBy"      TEXT                     NOT NULL,
    "lastModifiedBy" TEXT                     NOT NULL,
    "createdAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create CarSpecification table
CREATE TABLE "CarSpecification"
(
    id           TEXT PRIMARY KEY,
    transmission TEXT,
    "fuelType"   TEXT,
    seats        INTEGER,
    luggage      INTEGER,
    mileage      TEXT,
    "carId"      TEXT NOT NULL UNIQUE REFERENCES "Car" (id) ON DELETE CASCADE
);

-- Create Booking table
CREATE TABLE "Booking"
(
    id           TEXT PRIMARY KEY,
    "startDate"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "endDate"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "totalPrice" DECIMAL(10, 2)           NOT NULL,
    status       "BookingStatus"          NOT NULL DEFAULT 'PENDING',
    "carId"      TEXT                     NOT NULL REFERENCES "Car" (id),
    "userId"     TEXT                     NOT NULL REFERENCES "User" (id),
    "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create BookingExtras table
CREATE TABLE "BookingExtras"
(
    id                 TEXT PRIMARY KEY,
    insurance          BOOLEAN NOT NULL DEFAULT false,
    gps                BOOLEAN NOT NULL DEFAULT false,
    "childSeat"        BOOLEAN NOT NULL DEFAULT false,
    "additionalDriver" BOOLEAN NOT NULL DEFAULT false,
    "bookingId"        TEXT    NOT NULL UNIQUE REFERENCES "Booking" (id) ON DELETE CASCADE
);

-- Create Payment table
CREATE TABLE "Payment"
(
    id          TEXT PRIMARY KEY,
    amount      DECIMAL(10, 2)           NOT NULL,
    status      "PaymentStatus"          NOT NULL DEFAULT 'PENDING',
    method      TEXT,
    "bookingId" TEXT                     NOT NULL UNIQUE REFERENCES "Booking" (id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Maintenance table
CREATE TABLE "Maintenance"
(
    id            TEXT PRIMARY KEY,
    type          TEXT                     NOT NULL,
    description   TEXT                     NOT NULL,
    date          TIMESTAMP WITH TIME ZONE NOT NULL,
    cost          DECIMAL(10, 2)           NOT NULL,
    "carId"       TEXT                     NOT NULL REFERENCES "Car" (id),
    "performedBy" TEXT                     NOT NULL,
    "createdAt"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX "User_email_idx" ON "User" (email);
CREATE INDEX "User_role_idx" ON "User" (role);
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken" ("userId");
CREATE INDEX "Car_make_model_idx" ON "Car" (make, model);
CREATE INDEX "Car_type_idx" ON "Car" (type);
CREATE INDEX "Car_availability_idx" ON "Car" (availability);
CREATE INDEX "Booking_userId_idx" ON "Booking" ("userId");
CREATE INDEX "Booking_status_idx" ON "Booking" (status);
CREATE INDEX "Booking_dates_idx" ON "Booking" ("startDate", "endDate");
CREATE INDEX "Maintenance_carId_idx" ON "Maintenance" ("carId");
CREATE INDEX "Maintenance_date_idx" ON "Maintenance" (date);

-- Insert admin user
INSERT INTO "User" (id,
                    email,
                    password,
                    role,
                    "firstName",
                    "lastName",
                    "isVerified")
VALUES ('admin',
        'admin@example.com',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHHSwQUSxPFIWYw2C', -- password: admin123
        'ADMIN',
        'Admin',
        'User',
        true);