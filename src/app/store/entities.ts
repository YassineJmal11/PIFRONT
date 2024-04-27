export class Product {
    productId!: number;
    category!: ProductCategory | null;
    mark!: ProductMark | null;
    disponibility!: ProductDisponibility;
    name!: string;
    description!: string;
    technicalName!: string;
    technicalDescription!: string;
    createdAt!: Date;
    price!: number;
    quantity!: number;
    seller!: User | null;
    stores!: PhysicalStore[];
    images!: string[];
    reviews!: ProductReview[];
}

export enum ProductCategory {
    SPORTS_EQUIPMENT = 'Sports Equipment',
    FITNESS_ACCESSORIES = 'Fitness Accessories',
    GYM_APPAREL = 'Gym Apparel',
    NUTRITIONAL_SUPPLEMENTS = 'Nutritional Supplements',
    FITNESS_TRACKERS = 'Fitness Trackers',
    SPORTS_NUTRITION = 'Sports Nutrition',
    YOGA_ACCESSORIES = 'Yoga Accessories',
    RECOVERY_EQUIPMENT = 'Recovery Equipment',
    OUTDOOR_ACTIVITIES = 'Outdoor Activities'
}

export class ProductMark {
    productMarkId!: number;
    name!: string;
    description!: string;
}

export enum ProductDisponibility {
    IN_STOCK = "IN_STOCK",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    PREORDER_AVAILABLE = "PREORDER_AVAILABLE",
    LIMITED_STOCK = "LIMITED_STOCK",
    ARRIVING = "ARRIVING"
}

export class ProductReview {
    productReviewId!: number;
    product!: Product | null;
    user!: User;
    rating!: number;
    comment!: string;
    reviewDate!: Date;
}

export class PhysicalStore {
    physicalStoreId!: number;
    name!: string;
    description!: string;
    location!: string;
    workHours!: string;
    image!: string;
    products!: Product[];
}



export class User {
    userId!: number;
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    phoneNumber!: number;
    dateOfBirth!: Date;
    gender!: string;
    weight!: number;
    height!: number;
}
