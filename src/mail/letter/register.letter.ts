import { IEventItem } from 'interfaces';

export const registerLetter = (link: string, event: IEventItem) => {
  const { title, description, date, price, minAge, language, imagePath } =
    event;

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
      <h1 style="color: #333;">Welcome to Our Event Registration</h1>
      <p style="font-size: 16px; color: #666;">We're excited that you'll be joining us at our upcoming event:</p>
      <h2 style="font-size: 20px; color: #333;">${title}</h2>
      <p style="font-size: 16px; color: #666;">${description}</p>
      <p style="font-size: 16px; color: #666;">Date: ${date}</p>
      <p style="font-size: 16px; color: #666;">Price: ${price}</p>
      <p style="font-size: 16px; color: #666;">Minimum Age: ${minAge}</p>
      <p style="font-size: 16px; color: #666;">Language: ${language}</p>
      <img src="${imagePath}" alt="Event Photo" style="max-width: 50%; margin-top: 20px;">
      <p style="font-size: 16px; color: #666;">To complete your registration, please follow the link below:</p>
      <a href="${link}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; margin-top: 20px; border-radius: 5px;">Register Now</a>
      <p style="font-size: 14px; color: #999; margin-top: 20px;">If you encounter any issues or have any questions, please don't hesitate to reach out to our support team.</p>
    </div>
  `;
};
