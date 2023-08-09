You need to create a small application for managing user authentication and two-factor authorization.
 
Tasks:
1. Implement user registration with data stored in MongoDB.
2. Implement the ability for users to change their password. Users should log in with their email and old password, after which they can change it to a new one.
3. Implement user authentication using JWT (JSON Web Token). Upon successful authentication, the user should receive a token to access protected resources.
4. Implement QR code generation for user two-factor authorization. The QR code should contain the user's secret key and be associated with their account.
5. Add the ability to log in using two-factor authorization. Users must enter their password and a one-time code generated from the QR code to successfully log in.
6. Create a GraphQL API using Apollo Server to perform registration, login, password change, and two-factor authorization operations.
7. Adhere to SOLID principles in the application's design and development.
 
Requirements:
- All data must be stored in MongoDB.
- TypeScript usage is mandatory.
- The project must include installation and startup documentation.
- Code should be clean, well-organized, and adequately commented.
- Ensure the security and protection of user data.
 
Evaluation:
The assessment of the test task will consider the following criteria:
- Compliance with requirements and functionality.
- Code quality and organization.
- Security and data protection.
- Adherence to SOLID principles.
- Proficient use of TypeScript and Apollo GraphQL.
