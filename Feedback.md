# Feedback

This is a report discussing and testing the following website: **[Eatee](https://www.eateecats.be/)**

**Team:** [Callback Cats](https://github.com/EHB-TI/web-app-callback-cats)

## Introduction

The emphasis of our testing is on safety. Since functionality, risk and security influence each other, and often even determine each other, the business logic is also expected to be tested. Is the application achieving its objectives? Is the app doing this in a safe way? The threat model of the customer can help us with this. After all, a good threat model also contains risks that are specific to the application. Do we agree with our client's risk assessment? Are the main risks being addressed in a proper manner? We will pay special attention to access rights to see if they are properly enforced? To evaluate this we need to be able to sign up with different roles.

Throughout the testing of the website the uptime was not consistent. 

<br>

## 1. Evaluation criteria regarding registration and passwords

### **Log in and Registration:**

Users can **not** create an account in order to log in. This is a problem because the website is only available for users that are logged in. Upon visiting the website the user is prompted with a log in screen but since the users is not allowed to create an account it is impossible for a client to use the website. Demo accounts have been provided to make sure we could test the different functionalities of the website. But an outside user can not create his/her own account to access the services.  
Using the demo accounts we can navigate the different views of the website, the website clearly indicates whether the user is logged in or not and provides the functionality to log out if needed.

Since the registration is not functional, the user informations are not available. The user can not view or modify his/her personal information. Passwords can not be created which indicates that the criteria regarding password creation have not been met.

The passwords that have been provided alongside the demo accounts do not meeet the minimum requirements and are of a risky nature. The passwords do not contain any capital letters, punctuation, numbers or a defined length.

It is not possible to fully test the site, since different functionalities are missing it is nearly impossaible to discuss some of the criteria. 

Registration will not be used in the final version of the projects since it will make use of the Ehb portal API. Log in is a proof-of-concept and is used to differentiate the student and admin views. This will eventually be removed, thus making the above feedback insignificant.

<br>

### **Uncaught errors:**

> _The log in does not work on the following version of the website: https://www.eateecats.be/, the log in does work on the following modified version: https://eateecats.be/.  
> We think this occurs because the **[first](https://www.eateecats.be/)** version is a subdomain of the **[second](https://eateecats.be/)** version._

<br>

## 2. Acceptance criteria

| Passed | Criteria                                                                              | Notes                                | Severity |
| :----: | --------------------------------------------------------------------------------------| ------------------------------------ | :------: |
|   YES  | As as student I can see the menu of today                                             |  --                                  |  ------  |
|   YES  | As as student I can see the allergies, price and availability of a product/meal       |  --                                  |   HIGH   |
|   NO   | As a student I create a sandwich with available products                              | (1), (2), (3)                        | CRITICAL |
|   YES  | As a student I can pay my order in advance                                            | (4)                                  |   LOW    |
|   YES  | As a student I can log in/log out                                                     | (5)                                  |   LOW    |
|   NO   | As a student I can change my password                                                 | User info are not available.         |  MEDIUM  |
|   NO   | As a student I can update my 2-factor authentication                                  | (6)                                  |  MEDIUM  |
|   --   | As a student I receive an email when my order is ready                                | User info are not available.         |  ------  |
|   YES  | As a student I can see my previous orders                                             |  --                                  |  ------  |
|   YES  | As a school restaurant employee I can see which orders have been placed               |  --                                  |  ------  |
|   NO   | As a school restaurant employee I can check out an order when it is ready             | (7)                                  |   LOW    |
|   NO   | As a school restaurant employee I can create/view/edit/remove menus                   | This option is not available.        |   LOW    |
|   YES  | As a school restaurant employee I can create/view/edit/remove products                | (8)                                  |   LOW    |
|   YES  | As a school restaurant employee I can check the stock                                 |  --                                  |  ------  |

<br>

(1) : Creation is successfull only the first time, once i try to make a new sandwich the website periodically doesn't display the correct information.<br>
(2) : Once the sandwich is created, the details about the specif sandwich are not displayed in the cart.<br>
(3) : Removing one item of the cart results in a complete wipe of the current cart/session.<br>
(4) : Checkout is in test mode, clicking the cancel button redirects you to a success message even though the payment did not succeed.<br>
(5) : The log in/log out did not work properly during the tresting of the application.<br>
(6) : The option is displayed in the profile view but is not equiped with any logic/code to execute.<br>
(7) : Orders can not be processed through the admin dashboard, the 'Process' button does not execute any code, and leads to an 502 error.<br>
(8) : Once a product is created the admin is not redirected to the stock page, the admin has to manually go back and refresh the page to see the results.<br>

<br>

**Other Issues:**<br>
Orders do not alter the stock of a product. This is not actually testable since we can not perform a legitimate order. No code has been found to perform this.<br>

<br>



## 3. Evaluation criteria regarding HTTPS <br>

| Passed | Criteria                                                                              | Notes                                | Severity |
| :----: | --------------------------------------------------------------------------------------| ------------------------------------ | :------: |
|   YES  | Is HTTPS used everywhere?                                                             | (1)                                  |  ------  |
|   YES  | Every respons contains a `Strict-Transport-Security` header                          | --                                   |  ------  |
|   YES  | SSL Labs server test result = A, A+                                                   | (2)                                  |  ------  |
|   YES  | In HSTS Preload List ?                                                                | (3)                                  |  ------  |
|   YES  | Security Headers                                                                      | (4)                                  |  ------  |
|   YES  | CAA DNS Records                                                                       | (5)                                  |  ------  |

<br>

(1) : All the views use HTTPS to make sure all communication and customer information is protected. Using HTTPS also prevents Man-in-the-Middle attacks.<br>
(2) : The server test by **[SSL Labs](https://www.ssllabs.com/ssltest/index.html)** results in a A+ mark. Each response contains a Strict-Transport-Security header.<br>
(3) : The website is pending submission to the preload list. The following site is used to check its status: **[HSTS](https://hstspreload.org/)**<br>
(4) : The domain contains all the needed security headers. The following site is used to check the headers: **[Security Headers](https://securityheaders.com/)**<br>
(5) : A valid CAA DNS Records has been issued to this website. The following site is used to check the DNS-record: **[DNS CAA Tester](https://caatest.co.uk/)**<br>


**Other Issues:**<br>
There is no control over the cached content because the caching headers are not defined properly. An attacker with local access to a user’s web browser may be able to retrieve cached copies of resources that the user previously accessed, exposing any stored sensitive data. [Source](https://gaya3-r.medium.com/cache-control-header-is-missing-for-a-sensitive-page-168ac9f43e12)(1)<br>

**Possible fixes:** <br>
```
(1) : `Cache-Control: private, no-cache, no-store, max-age=0, no-transform`
```
<br>

## 4. Evaluation criteria regarding protection against typical web vulnerabilities

| Passed | Criteria                                                                              | Notes                                | Severity |
| :----: | --------------------------------------------------------------------------------------| ------------------------------------ | :------: |
|   NO   | Secrets are not publicly available                                                    | (1)                                  | CRITICAL |
|   YES  | Correct use of Cookies                                                                | (2)                                  |  ------  |
|   NO   | SQL-Injection                                                                         | (3)                                  | CRITICAL |
|   YES  | Basic CSP Protection is active                                                        | --                                   |  ------  |
|   YES  | Formjacking                                                                           | --                                   |  ------  |
|   YES  | XSS (Cross-site scripting)                                                            | --                                   |  ------  |
|   YES  | Clickjacking                                                                          | --                                   |  ------  |
|   YES  | `X-Content-Type-Options: nosniff` is used to prevent MIME sniffing.                   | --                                   |  ------  |
|   NO   | Prevent `unsafe-inline`                                                               | (4)                                  |  ------  |
|   NO   | The `X-Frame-Options` header is defined and combined with the `frame-ancestors`       | --                                   |  ------  |
|   YES  | Prevent unnecessary code                                                              | --                                   |  ------  |

<br>

(1) : The `.env` file is stored on the github repository. The `.env`  file contains all the credentials, API keys and description of the databse strucutre. This makes the database accessible to anyone with the correct connections strings. To patch this vulnerability the `.env` file should not be commited by the developpers themselves but should be generated or stored locally. Another potential fix is to use **[Github's Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)** a funcionality allowing users to store environments variables without them being accesible. The database should be secured by only allowing a select group of IP-adresses to log into the database.<br>
(2) : All the used cookies have successfully been implemented and are used on a strict manner. 
(3) : The API does not perfrom any additional checks when recieving a database query. The following route is vulnerable to these kind of attacks: `backend/config/functions.js`. 
(4) :  The website allows unsafe inline scripts to be executed. A nonce or a hash can be used to allow only certain scripts to be executed and to block all the others.

<br>

**Other Issues:**<br>
The `X-Powered-By` header should be disabled/hidden to keep this information classified. This can be achieved with the following fixes: 
- `app.disable('x-powered-by');`
- `res.setHeader( 'X-Powered-By', 'False information v0.0.1' );`

<br>

## 5. Threat Model

### Modifications threat
Since React.js is a [client-side framework](https://yudhajitadhikary.medium.com/client-side-rendering-vs-server-side-rendering-in-react-js-next-js-b74b909c7c51) the threat model should be modified. The client communicates directly with the API itself through Cloudflare and doesnt use the web server. The web server is only used to get the necessary runtime data but doesnt forward the incoming requests. The web server and the API do not communicate with each other.

### DoS / DDoS Attack
The website is protected by Cloudflare. This protects the site against all possible (D)DOS-Attacks.

<br>

## 6. REST API - SCA


https://api.eateecats.be/api/v1 :<br>
Anybody with the above link and a user account can access the API using the cookies stored in the browser. These cookies are obtained by logging into the main part of the website and are stored in the browser thus giving you access to the API routes and info. (1)

https://api.eateecats.be/api/v1/orders : <br>
As a student I can get all the ongoing orders, this can be a big privacy issue. (1)

https://api.eateecats.be/api/v1/products/add : <br>
As a student I can copy cookies and use then to post unapropriate data directly to the database. Even if I am not an admin. (1)

https://api.eateecats.be/api/v1/orders : <br>
As a student I can copy cookies and use it to delete orders, post them, put  the price to 0. And get a free meal. (1)

https://api.eateecats.be/api/v1/createPaymentIntent : <br>
As a student I can create as much payment intents as I want, without providing any card information. (1)

<br>

**Possible fixes:**<br>

```
(1) : Block the access to ressources by checking who is logged in.

if(req.user.type != 'admin') 
        return res.status(403).send('No permission to access this content.')
```
<br>

## 7. OWASP ZAP

| Alert                                                                                 | Solution                             | Risk            |
| --------------------------------------------------------------------------------------| ------------------------------------ | :-------------: |
| CSP: script-src unsafe-inline                                                         | (1)                                  |  MEDIUM         |
| Incomplete or No Cache-control Header Set                                             | (2)                                  |  LOW            |
| Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)             | (3)                                  |  LOW            |
| Timestamp Disclosure - Unix                                                           | (4)                                  |  MEDIUM         |
| Information Disclosure - Suspicious Comments                                          | (5)                                  |  INFROMATIONAL  |

(1) : Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.<br>
(2) : Whenever possible ensure the cache-control HTTP header is set with no-cache, no-store, must-revalidate.<br>
(3) : Ensure that your web server, application server, load balancer, etc. is configured to suppress "X-Powered-By" headers.<br>
(4) : Manually confirm that the timestamp data is not sensitive, and that the data cannot be aggregated to disclose exploitable patterns.<br>
(5) : Remove all comments that return information that may help an attacker and fix any underlying problems they refer to.<br>

<br>

## 8. Other 

### URL Scan:

This website contacted **4 IPs** in **1 country** across **3 domains** to perform **14 HTTP transactions**. The main IP is **2606:4700:3033::6815:6d1**, located in **United States** and belongs to **CLOUDFLARENET, US**. The main domain is **eateecats.be.**
TLS certificate: Issued by Cloudflare Inc ECC CA-3 on November 20th 2021. Valid for: a year.

###  2GDPR:

This scan did not find any known issues.



