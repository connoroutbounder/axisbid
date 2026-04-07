// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.bid.deleteMany()
  await prisma.machine.deleteMany()
  await prisma.job.deleteMany()
  await prisma.shop.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create customers
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      name: 'John Smith',
      passwordHash: await hash('password123', 10),
      role: Role.CUSTOMER,
      company: 'TechCorp Manufacturing',
      phone: '555-0101',
      emailVerified: new Date(),
    },
  })

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      name: 'Sarah Johnson',
      passwordHash: await hash('password123', 10),
      role: Role.CUSTOMER,
      company: 'Precision Parts Inc',
      phone: '555-0102',
      emailVerified: new Date(),
    },
  })

  const customer3 = await prisma.user.create({
    data: {
      email: 'customer3@example.com',
      name: 'Michael Chen',
      passwordHash: await hash('password123', 10),
      role: Role.CUSTOMER,
      company: 'Industrial Solutions LLC',
      phone: '555-0103',
      emailVerified: new Date(),
    },
  })

  console.log('Created 3 customers')

  // Create shop owners
  const shop1Owner = await prisma.user.create({
    data: {
      email: 'shop1@example.com',
      name: 'Robert Wilson',
      passwordHash: await hash('password123', 10),
      role: Role.SHOP_OWNER,
      company: 'Elite CNC Machining',
      phone: '555-1001',
      emailVerified: new Date(),
    },
  })

  const shop2Owner = await prisma.user.create({
    data: {
      email: 'shop2@example.com',
      name: 'Maria Garcia',
      passwordHash: await hash('password123', 10),
      role: Role.SHOP_OWNER,
      company: 'Precision Metal Works',
      phone: '555-1002',
      emailVerified: new Date(),
    },
  })

  const shop3Owner = await prisma.user.create({
    data: {
      email: 'shop3@example.com',
      name: 'David Thompson',
      passwordHash: await hash('password123', 10),
      role: Role.SHOP_OWNER,
      company: 'Advanced Manufacturing Co',
      phone: '555-1003',
      emailVerified: new Date(),
    },
  })

  const shop4Owner = await prisma.user.create({
    data: {
      email: 'shop4@example.com',
      name: 'Lisa Anderson',
      passwordHash: await hash('password123', 10),
      role: Role.SHOP_OWNER,
      company: '5-Axis Innovations',
      phone: '555-1004',
      emailVerified: new Date(),
    },
  })

  const shop5Owner = await prisma.user.create({
    data: {
      email: 'shop5@example.com',
      name: 'James Rodriguez',
      passwordHash: await hash('password123', 10),
      role: Role.SHOP_OWNER,
      company: 'Titanium Specialists',
      phone: '555-1005',
      emailVerified: new Date(),
    },
  })

  console.log('Created 5 shop owners')

  // Create shops with machines
  const shop1 = await prisma.shop.create({
    data: {
      userId: shop1Owner.id,
      name: 'Elite CNC Machining',
      description: 'Premier CNC machining services with 25+ years of experience. Specializing in aerospace and medical parts.',
      address: '123 Industrial Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      phone: '555-1001',
      website: 'https://elitecnc.example.com',
      yearsInBusiness: 25,
      employeeCount: 15,
      certifications: ['AS9100', 'ISO9001', 'ITAR'],
      materials: ['Aluminum', 'Steel', 'Titanium', 'Stainless Steel'],
      maxPartSize: '36x36x24 inches',
      rating: 4.8,
      totalJobs: 145,
      completedJobs: 142,
      onTimeRate: 98,
      isVerified: true,
      isActive: true,
    },
  })

  const shop2 = await prisma.shop.create({
    data: {
      userId: shop2Owner.id,
      name: 'Precision Metal Works',
      description: 'Custom CNC machining for prototypes and production runs. Fast turnaround times.',
      address: '456 Tech Park',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      phone: '555-1002',
      website: 'https://precisionmetal.example.com',
      yearsInBusiness: 18,
      employeeCount: 12,
      certifications: ['ISO13485', 'ISO9001'],
      materials: ['Aluminum', 'Brass', 'Copper', 'Acetal'],
      maxPartSize: '24x24x18 inches',
      rating: 4.6,
      totalJobs: 98,
      completedJobs: 96,
      onTimeRate: 95,
      isVerified: true,
      isActive: true,
    },
  })

  const shop3 = await prisma.shop.create({
    data: {
      userId: shop3Owner.id,
      name: 'Advanced Manufacturing Co',
      description: 'Full-service machining with 5-axis capabilities. Medical and industrial components.',
      address: '789 Factory Drive',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      phone: '555-1003',
      website: 'https://advancedmfg.example.com',
      yearsInBusiness: 22,
      employeeCount: 18,
      certifications: ['AS9100', 'ISO13485', 'ITAR'],
      materials: ['Steel', 'Stainless Steel', 'Aluminum', 'Titanium'],
      maxPartSize: '48x48x36 inches',
      rating: 4.9,
      totalJobs: 167,
      completedJobs: 165,
      onTimeRate: 99,
      isVerified: true,
      isActive: true,
    },
  })

  const shop4 = await prisma.shop.create({
    data: {
      userId: shop4Owner.id,
      name: '5-Axis Innovations',
      description: 'Specializing in complex 5-axis machining. Rapid prototyping and production.',
      address: '321 Tech Ave',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      phone: '555-1004',
      website: 'https://5axisinnovations.example.com',
      yearsInBusiness: 12,
      employeeCount: 9,
      certifications: ['ISO9001'],
      materials: ['Aluminum', 'Composites', 'Plastics'],
      maxPartSize: '30x30x24 inches',
      rating: 4.7,
      totalJobs: 76,
      completedJobs: 74,
      onTimeRate: 96,
      isVerified: true,
      isActive: true,
    },
  })

  const shop5 = await prisma.shop.create({
    data: {
      userId: shop5Owner.id,
      name: 'Titanium Specialists',
      description: 'Expert titanium machining for aerospace and medical applications.',
      address: '654 Aerospace Way',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      phone: '555-1005',
      website: 'https://titaniumspecialists.example.com',
      yearsInBusiness: 19,
      employeeCount: 11,
      certifications: ['AS9100', 'ITAR'],
      materials: ['Titanium', 'Inconel', 'Aluminum'],
      maxPartSize: '40x40x30 inches',
      rating: 4.8,
      totalJobs: 103,
      completedJobs: 101,
      onTimeRate: 97,
      isVerified: true,
      isActive: true,
    },
  })

  console.log('Created 5 shops')

  // Add machines to shops
  await prisma.machine.createMany({
    data: [
      {
        shopId: shop1.id,
        name: 'Haas VF-2SS',
        type: MachineType.CNC_MILL,
        axes: 3,
        brand: 'Haas',
        model: 'VF-2SS',
        maxTravel: '30x16x20 inches',
        tolerance: '±0.0005 inches',
      },
      {
        shopId: shop1.id,
        name: 'Haas UMC750',
        type: MachineType.FIVE_AXIS,
        axes: 5,
        brand: 'Haas',
        model: 'UMC750',
        maxTravel: '30x24x25 inches',
        tolerance: '±0.0003 inches',
      },
      {
        shopId: shop2.id,
        name: 'Mazak Integrex',
        type: MachineType.FIVE_AXIS,
        axes: 5,
        brand: 'Mazak',
        model: 'Integrex 250',
        maxTravel: '28x28x25 inches',
        tolerance: '±0.0002 inches',
      },
      {
        shopId: shop2.id,
        name: 'CNC Lathe A',
        type: MachineType.CNC_LATHE,
        axes: 2,
        brand: 'Okuma',
        model: 'LU-200',
        maxTravel: '10 inch swing',
        tolerance: '±0.001 inches',
      },
      {
        shopId: shop3.id,
        name: 'Doosan DNM 650',
        type: MachineType.FIVE_AXIS,
        axes: 5,
        brand: 'Doosan',
        model: 'DNM 650',
        maxTravel: '48x36x36 inches',
        tolerance: '±0.0003 inches',
      },
      {
        shopId: shop3.id,
        name: 'Surface Grinder',
        type: MachineType.SURFACE_GRINDER,
        axes: 3,
        brand: 'Kuroda',
        model: 'KSG-2040',
        maxTravel: '20x40 inches',
        tolerance: '±0.0001 inches',
      },
      {
        shopId: shop4.id,
        name: 'Fanuc Robodrill',
        type: MachineType.CNC_MILL,
        axes: 3,
        brand: 'Fanuc',
        model: 'Robodrill D21SiA',
        maxTravel: '24x20x20 inches',
        tolerance: '±0.0005 inches',
      },
      {
        shopId: shop4.id,
        name: 'Router Table',
        type: MachineType.CNC_ROUTER,
        axes: 3,
        brand: 'ShopBot',
        model: 'PRS Alpha',
        maxTravel: '36x48x6 inches',
        tolerance: '±0.010 inches',
      },
      {
        shopId: shop5.id,
        name: 'Makino Pro5',
        type: MachineType.FIVE_AXIS,
        axes: 5,
        brand: 'Makino',
        model: 'Pro5',
        maxTravel: '40x30x30 inches',
        tolerance: '±0.0002 inches',
      },
      {
        shopId: shop5.id,
        name: 'EDM Wire',
        type: MachineType.EDM_WIRE,
        axes: 4,
        brand: 'Sodick',
        model: 'AQ-max',
        maxTravel: '42x28 inches',
        tolerance: '±0.0001 inches',
      },
    ],
  })

  console.log('Created 10 machines')

  // Create jobs
  const job1 = await prisma.job.create({
    data: {
      userId: customer1.id,
      title: 'Aluminum Bracket Assembly',
      status: JobStatus.BIDDING,
      material: 'Aluminum 6061-T6',
      surfaceFinish: 'Anodized',
      tolerance: '±0.005 inches',
      quantity: 50,
      neededBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes: 'High-precision bracket for aerospace application. Multiple drilling and tapping operations required.',
      fileName: 'bracket-assembly.step',
      fileUrl: 'https://axisbid-files.s3.us-east-1.amazonaws.com/uploads/bracket-assembly.step',
      fileSize: 245000,
      boundingBox: { x: 120, y: 80, z: 45 },
      volume: 432,
      surfaceArea: 62.4,
      faceCount: 8,
      edgeCount: 24,
      holeCount: 6,
      pocketCount: 2,
      complexity: 'MEDIUM',
      aiEstimateLow: 1800,
      aiEstimateHigh: 2400,
      aiEstimateMid: 2100,
      aiConfidence: 0.92,
      aiReasoning: 'Moderate complexity with multiple holes and pockets. Aluminum is easy to machine. Mid-range confidence based on clear geometry.',
      bidDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  })

  const job2 = await prisma.job.create({
    data: {
      userId: customer2.id,
      title: 'Titanium Implant Component',
      status: JobStatus.BIDDING,
      material: 'Titanium Grade 5',
      surfaceFinish: 'Polished to Ra 0.4 µm',
      tolerance: '±0.001 inches',
      quantity: 100,
      neededBy: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      notes: 'Medical implant component. Strict tolerances and surface finish requirements. FDA compliance needed.',
      fileName: 'implant-component.step',
      fileUrl: 'https://axisbid-files.s3.us-east-1.amazonaws.com/uploads/implant-component.step',
      fileSize: 156000,
      boundingBox: { x: 45, y: 30, z: 22 },
      volume: 29.7,
      surfaceArea: 12.8,
      faceCount: 12,
      edgeCount: 48,
      holeCount: 3,
      pocketCount: 1,
      complexity: 'HIGH',
      aiEstimateLow: 8500,
      aiEstimateHigh: 11200,
      aiEstimateMid: 9850,
      aiConfidence: 0.88,
      aiReasoning: 'High precision medical component. Titanium is difficult to machine (lower feed rates). Strict surface finish multiplier applied.',
      bidDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  })

  const job3 = await prisma.job.create({
    data: {
      userId: customer3.id,
      title: 'Steel Shaft with Splines',
      status: JobStatus.QUOTING,
      material: 'Steel 4140',
      surfaceFinish: 'As-machined',
      tolerance: '±0.010 inches',
      quantity: 25,
      neededBy: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: 'Drive shaft with spline profile. Requires lathe work and some milling.',
      fileName: 'drive-shaft.step',
      fileUrl: 'https://axisbid-files.s3.us-east-1.amazonaws.com/uploads/drive-shaft.step',
      fileSize: 89000,
      boundingBox: { x: 80, y: 80, z: 300 },
      volume: 1920,
      surfaceArea: 85.6,
      faceCount: 6,
      edgeCount: 12,
      holeCount: 0,
      pocketCount: 0,
      complexity: 'MEDIUM',
      aiEstimateLow: 2200,
      aiEstimateHigh: 2800,
      aiEstimateMid: 2500,
      aiConfidence: 0.85,
      aiReasoning: 'Steel shaft with straightforward geometry. Lathe work is efficient. Moderate setup time for spline tooling.',
    },
  })

  const job4 = await prisma.job.create({
    data: {
      userId: customer1.id,
      title: 'Prototype Enclosure',
      status: JobStatus.QUOTING,
      material: 'Aluminum 6061-T6',
      surfaceFinish: 'Anodized (Black)',
      tolerance: '±0.025 inches',
      quantity: 5,
      neededBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: 'Rapid prototype for electronics enclosure. Quick turnaround needed.',
      fileName: 'enclosure-prototype.step',
      fileUrl: 'https://axisbid-files.s3.us-east-1.amazonaws.com/uploads/enclosure-prototype.step',
      fileSize: 312000,
      boundingBox: { x: 200, y: 150, z: 80 },
      volume: 2400,
      surfaceArea: 142,
      faceCount: 10,
      edgeCount: 36,
      holeCount: 8,
      pocketCount: 3,
      complexity: 'MEDIUM',
      aiEstimateLow: 600,
      aiEstimateHigh: 900,
      aiEstimateMid: 750,
      aiConfidence: 0.87,
      aiReasoning: 'Prototype run with loose tolerances. Small quantity increases per-unit cost. Straightforward enclosure geometry.',
    },
  })

  const job5 = await prisma.job.create({
    data: {
      userId: customer2.id,
      title: 'Complex 5-Axis Blade',
      status: JobStatus.PENDING,
      material: 'Aluminum 7075-T73',
      surfaceFinish: 'Class A surface',
      tolerance: '±0.003 inches',
      quantity: 10,
      neededBy: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      notes: 'Turbine blade with complex curvature. Requires simultaneous 5-axis machining.',
      fileName: 'turbine-blade.step',
      fileUrl: 'https://axisbid-files.s3.us-east-1.amazonaws.com/uploads/turbine-blade.step',
      fileSize: 567000,
      boundingBox: { x: 60, y: 40, z: 150 },
      volume: 360,
      surfaceArea: 98.5,
      faceCount: 18,
      edgeCount: 72,
      holeCount: 0,
      pocketCount: 4,
      complexity: 'VERY_HIGH',
      aiEstimateLow: 3500,
      aiEstimateHigh: 5200,
      aiEstimateMid: 4350,
      aiConfidence: 0.78,
      aiReasoning: 'Complex 5-axis geometry with high surface finish requirements. Difficult to program and set up. Lower confidence due to design complexity.',
    },
  })

  console.log('Created 5 jobs')

  // Create bids
  const bid1 = await prisma.bid.create({
    data: {
      jobId: job1.id,
      shopId: shop1.id,
      price: 2150,
      estimatedDays: 12,
      notes: 'Standard pricing. Can meet your deadline easily.',
      approach: '3-axis milling with anodizing outsourced. Total turnaround 12 days.',
      status: BidStatus.PENDING,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  })

  const bid2 = await prisma.bid.create({
    data: {
      jobId: job1.id,
      shopId: shop2.id,
      price: 1950,
      estimatedDays: 14,
      notes: 'Competitive pricing for volume run.',
      approach: 'Will consolidate to minimize setup time. Anodizing in-house.',
      status: BidStatus.PENDING,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  })

  const bid3 = await prisma.bid.create({
    data: {
      jobId: job1.id,
      shopId: shop3.id,
      price: 2350,
      estimatedDays: 10,
      notes: 'Premium pricing for fastest turnaround. We have the most advanced 5-axis equipment.',
      approach: '5-axis simultaneous for higher precision. In-house anodizing. Rush job pricing applied.',
      status: BidStatus.PENDING,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  })

  const bid4 = await prisma.bid.create({
    data: {
      jobId: job2.id,
      shopId: shop5.id,
      price: 9850,
      estimatedDays: 20,
      notes: 'Specialists in titanium medical components. Full traceability and FDA documentation.',
      approach: 'Multi-axis programming for best surface finish. ISO13485 compliant process. Rigorous inspection.',
      status: BidStatus.PENDING,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  })

  const bid5 = await prisma.bid.create({
    data: {
      jobId: job2.id,
      shopId: shop3.id,
      price: 10500,
      estimatedDays: 18,
      notes: 'AS9100 and ISO13485 certified. Can accommodate medical requirements.',
      approach: 'Combination of 5-axis and manual polishing for final surface finish.',
      status: BidStatus.PENDING,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  })

  console.log('Created 5 bids')

  // Create a review
  const review1 = await prisma.review.create({
    data: {
      jobId: job4.id,
      userId: customer1.id,
      shopId: shop2.id,
      rating: 5,
      quality: 5,
      timeliness: 4,
      communication: 5,
      comment: 'Excellent work on the enclosure. Quality exceeded expectations. Will definitely order again.',
    },
  })

  console.log('Created 1 review')

  // Update shop ratings
  await prisma.shop.update({
    where: { id: shop2.id },
    data: {
      rating: 4.6,
      completedJobs: 97,
      totalJobs: 99,
    },
  })

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
