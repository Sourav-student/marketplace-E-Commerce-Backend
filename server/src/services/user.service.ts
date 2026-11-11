import { prisma } from "../lib/prisma";
import { AddressDataType, MobileType, UserDataType } from "../types/types";
import { AppError } from "../utils/app-error";

export async function getUserInfoService(id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      mobile_no: true,
      alternative_mobile_no: true,
    }
  });

  if (!user) {
    throw new AppError("user with user_id is not exist", 404);
  }

  return user;
}

export async function updateMobileNumberService(data: MobileType, id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id
    }
  });

  if (!user) {
    throw new AppError("user does not exist", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(data.mobile_no != null && { mobile_no: data.mobile_no }),

      ...(data.alternative_mobile_no != null && { alternative_mobile_no: data.alternative_mobile_no })
    },

    select: {
      id: true,
      email: true,
      username: true,
      mobile_no: true,
      alternative_mobile_no: true,
      updatedAt: true,
    },
  });

  if (!updatedUser) {
    throw new AppError("can't update currently try again later", 500);
  }

  return updatedUser;
}

export async function updateUserNameService(name: string, id: string) {
  if (typeof name !== "string" || !name.trim()) {
    throw new AppError("provide a valid name", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError("user not found!", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: name.trim(),
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      mobile_no: true,
      alternative_mobile_no: true,
      updatedAt: true,
    },
  });

  if (!updatedUser) {
    throw new AppError("can't update currently try again later", 500);
  }

  return updatedUser;
}

export async function createAddressService(data: AddressDataType, id: string) {
  if (!id) {
    throw new AppError("login again!", 409);
  }

  const { addressLine1, addressLine2, city, country, postalCode, state }: AddressDataType = data;

  if (!addressLine1 || !city || !country || !postalCode || !state) {
    throw new AppError("fill the require fields", 400);
  }

  const address = await prisma.address.create({
    data: {
      addressLine1,
      addressLine2: addressLine2 == null ? "" : addressLine2,
      state,
      postalCode,
      city,
      country,
      user_id: id
    },

    select: {
      id: true,
      user_id: true,
      addressLine1: true,
      addressLine2: true,
      postalCode: true,
      city: true,
      state: true,
      country: true,
      createdAt: true
    }
  });

  if (!address) {
    throw new AppError("no address create!", 500);
  }

  return address;
}

export async function getAllAddressService(id: string) {
  const addresses = await prisma.address.findMany({
    where: {
      user_id: id
    }
  });

  if (!addresses) {
    throw new AppError("no address found", 404);
  }

  return addresses;
}

export async function updateAddressService(data: AddressDataType, id: string, user_id: string) {
  const { addressLine1, addressLine2, postalCode, city, state, country } = data;

  if (!id) {
    throw new AppError("something went wrong!", 500);
  }

  const address = await prisma.address.findFirst({
    where: { id, user_id },
  });

  if (!address) {
    throw new AppError("no address present with the address id", 404);
  }

  const updatedAddress = await prisma.address.update({
    where: { id },
    data: {
      ...(addressLine1 !== null && addressLine1 !== undefined && { addressLine1 }),
      ...(addressLine2 !== null && addressLine2 !== undefined && { addressLine2 }),
      ...(postalCode !== null && postalCode !== undefined && { postalCode }),
      ...(city !== null && city !== undefined && { city }),
      ...(state !== null && state !== undefined && { state }),
      ...(country !== null && country !== undefined && { country }),
    },

    select: {
      addressLine1: true, addressLine2: true, city: true, country: true, state: true, postalCode: true
    }
  });

  if (!updatedAddress) {
    throw new AppError("can't update address", 400);
  }

  return updatedAddress;
}

export async function deleteAddressService(id: string, user_id: string) {
  const deletedAddress = await prisma.address.delete({ where: { id, user_id } });

  if (!deletedAddress) {
    throw new AppError("can't delete", 400);
  }

  return deletedAddress;
}

export async function getOneAddressService(id : string, user_id : string) {
  if(!id){
    throw new AppError("address is not exist");
  }

  const address = await prisma.address.findFirst({where : {id, user_id},
    select : {
      addressLine1 : true, addressLine2 : true, postalCode : true, city : true, country : true, state : true
    }
  });

  if(!address){
    throw new AppError("address not found!", 404);
  }

  return address;
}