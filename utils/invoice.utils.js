import aws from "aws-sdk";
import PDFDocument from "pdfkit";
import axios from "axios";
import logger from "../logger/logger";
import moment from "moment";
 
export class InvoiceService {
     logoUrl;
     s3;
     bucket;

    constructor(awsBucket, logoUrl) {
        this.logoUrl = logoUrl ?? "http://dev--assets.s3.ap-south-1.amazonaws.com/logo.png";
        this.bucket = awsBucket;
        this.s3 = new aws.S3();
    }

     async generateInvoice(
        totalAmount,
        taxableAmount,
        taxAmount,
        invoiceNumber,
        mobilenumber,
        name,
        addressline1,
        addressline2,
        city,
        state,
        pincode,
        customerId,
        userType,
        productName
    ) {
        try {
            const logoImg = await axios.get(this.logoUrl, { responseType: "arraybuffer" });
            const doc = new PDFDocument();
            doc.image(logoImg.data, 240, 20, { fit: [100, 80] });
            doc
                .fontSize(11)
                .font("Courier")
                .fill("black")
                .text("EVENTSLINER INDIA PVT LTD", 360, 100);
            doc
                .fontSize(11)
                .font("Courier")
                .fill("black")
                .text("11/401, Palm Terraces Select");
            doc.fontSize(11).fill("black").text("Sec 66, Gurugram - 122018");
            doc.fontSize(11).fill("black").text("GST: "); //put GST here
            doc.fontSize(11).fill("black").text("CIN: "); //put CIN here
            doc.fontSize(11).fill("black").text("contactus@121cars.in");
            doc.fontSize(12).fill("black").text(`${name}`, 50, 100);
            if (addressline1 !== undefined) {
                doc.fontSize(11).font("Courier").fill("black").text(`${addressline1}`);
            }
            if (addressline1 !== undefined) {
                doc.fontSize(11).fill("black").text(`${addressline2}`);
            }
            doc.fontSize(11).fill("black").text(`${city} ${state} ${pincode ?? ""}`);
            doc.fontSize(11).fill("black").text(`Customer ID: ${customerId}`);
            doc.fontSize(11).fill("black").text(`Mobile Number: ${mobilenumber}`);
            doc.fontSize(15).fill("black").text("INVOICE", 265, 210);
            doc.fontSize(12).fill("grey").text("Date:", 50, 260);
            doc.fontSize(12).fill("black").text(`${moment(Date.now()).format('DD-MM-YYYY')}`, 180, 260);

            doc.fontSize(12).fill("grey").text("PLACE OF SUPPLY:", 50, 280);
            doc.fontSize(12).fill("black").text("Gurugram, Haryana", 180, 280);

            doc.fontSize(12).fill("grey").text("CUSTOMER TYPE:", 310, 260);
            doc.fontSize(12).fill("black").text(`${userType}`, 425, 260);

            doc.fontSize(12).fill("grey").text("INVOICE NUMBER:", 310, 280);
            doc.fontSize(12).fill("black").text(`${invoiceNumber}`, 425, 280);

            doc.moveTo(40, 320).lineTo(570, 320).stroke("black");

            doc.fontSize(10).fill("black").text("HSN/SAC", 60, 340);
            doc.fontSize(10).fill("black").text("DESCRIPTION", 150, 340);
            doc.fontSize(10).fill("black").text("QUANTITY", 350, 340);
            doc.fontSize(10).fill("black").text("AMOUNT(RS)", 450, 340);
            doc.moveTo(40, 370).lineTo(570, 370).stroke("black");
            doc.fontSize(10).fill("black").text("", 60, 390); //put HSN/SAC here
            doc.fontSize(10).fill("black").text(`${productName}`, 150, 390);
            doc.fontSize(10).fill("black").text("01", 370, 390);
            doc.fontSize(10).fill("black").text(`${totalAmount}`, 450, 390);

            doc.moveTo(40, 460).lineTo(570, 460).stroke("black");
            doc.fontSize(10).fill("black").text("NET TOTAL", 350, 480);
            doc.fontSize(10).fill("black").text(`${totalAmount}`, 450, 480);
            doc.moveTo(40, 505).lineTo(570, 505).stroke("black");

            doc.fontSize(10).fill("black").text("TAX RECIEPT SUMMARY", 50, 540);
            doc.fontSize(10).fill("black").text("TAX RATE", 50, 560);
            doc.fontSize(10).fill("black").text("TAXABLE AMOUNT", 170, 560);
            doc.fontSize(10).fill("black").text("TAX AMOUNT", 310, 560);
            doc.fontSize(10).fill("black").text("TOTAL", 460, 560);

            doc.fontSize(10).fill("black").text("SGST 9%", 50, 580);
            doc.fontSize(10).fill("black").text("CGST 9%", 50, 600);
            doc.fontSize(10).fill("black").text("IGST 18%", 50, 620);
            if (state !== "Haryana") {
                doc.fontSize(10).fill("black").text("TOTAL 18%", 50, 640);
            }
            doc.fontSize(10).fill("black").text(`${taxableAmount}`, 170, 580);
            doc.fontSize(10).fill("black").text(`${taxableAmount}`, 170, 600);
            if (state !== "Haryana") {
                doc.fontSize(10).fill("black").text(`${taxableAmount}`, 170, 620);
            }
            doc.fontSize(10).fill("black").text(`${taxAmount}`, 310, 580);
            doc.fontSize(10).fill("black").text(`${taxAmount}`, 310, 600);
            if (state !== "Haryana") {
                doc.fontSize(10).fill("black").text(`${taxAmount * 2}`, 310, 620);
            }
            doc.fontSize(10).fill("black").text(`${totalAmount}`, 450, 640);

            doc
                .fontSize(10)
                .fill("black")
                .text(
                    "DISCLAIMER: This is a computer generated invoice copy hence seal and signature not required.",
                    50,
                    675
                );
            doc
                .fontSize(10)
                .fill("black")
                .text(
                    "EVENTSLINER India Pvt. Ltd. may, at its sole discretion, relax or waive any of its conditions applicable.",
                    50,
                    698);
            doc.end();


            const params = {
                ACL: "-read",
                Key: `invoice/${invoiceNumber}.pdf`,
                Body: doc,
                Bucket: this.bucket,
                ContentType: "application/pdf"
            };
            const data = await this.s3.upload(params).promise();
            logger.info(data);
            return data;
        }
        catch(err) {
            logger.log("InvoiceService.generateInvoice: " + err);
            return null;
        }
    }
}