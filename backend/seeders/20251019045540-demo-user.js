'use strict';
import bcrypt from 'bcryptjs';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
  */
  const hashedPassword = await bcrypt.hash('password123', 10);
  await queryInterface.bulkInsert('Users', [{
    username: 'testUser',
    email: 'test@example.com',
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  await queryInterface.bulkDelete('Users', null, {});
}
