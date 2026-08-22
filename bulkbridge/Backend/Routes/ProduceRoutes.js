const express = require("express");
const Produce = require("../Models/Produce");

const router = express.Router();


// =====================================
// HELPER — attach computed status
// =====================================

function withStatus(produceDoc) {
    const item = produceDoc.toObject ? produceDoc.toObject() : produceDoc;
    const isExpired = new Date(item.availableUntil) < new Date(new Date().toDateString());
    return {
        ...item,
        status: isExpired ? "Expired" : "Available"
    };
}


// =====================================
// ADD PRODUCE
// =====================================

router.post("/add", async (req, res) => {

    try {

        const {
            farmerId,
            name,
            category,
            quantity,
            price,
            availableUntil
        } = req.body;


        const newProduce = new Produce({

            farmerId,
            name,
            category,
            quantity,
            price,
            availableUntil

        });


        await newProduce.save();


        res.status(201).json({

            message: "Produce added successfully",

            produce: withStatus(newProduce)

        });

    } catch (error) {

        console.log("PRODUCE ERROR:", error);

        res.status(500).json({

            message: "Failed to add produce",

            error: error.message

        });

    }

});


// =====================================
// GET ALL PRODUCE
// =====================================

router.get("/", async (req, res) => {

    try {

        const produces = await Produce.find().sort({ _id: -1 });

        res.status(200).json(produces.map(withStatus));

    } catch (error) {

        console.log("FETCH PRODUCE ERROR:", error);

        res.status(500).json({

            message: "Failed to fetch produce",

            error: error.message

        });

    }

});


// =====================================
// GET PRODUCE FOR ONE FARMER
// =====================================

router.get("/farmer/:farmerId", async (req, res) => {

    try {

        const produces = await Produce.find({ farmerId: req.params.farmerId }).sort({ _id: -1 });

        res.status(200).json(produces.map(withStatus));

    } catch (error) {

        console.log("FETCH FARMER PRODUCE ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch your produce",
            error: error.message
        });

    }

});


// =====================================
// GET ONE PRODUCE ITEM (for detail page)
// =====================================

router.get("/:id", async (req, res) => {

    try {

        const item = await Produce.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Produce not found" });
        }

        res.status(200).json(withStatus(item));

    } catch (error) {

        console.log("FETCH SINGLE PRODUCE ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch produce",
            error: error.message
        });

    }

});


// =====================================
// EDIT PRODUCE
// =====================================

router.put("/:id", async (req, res) => {

    try {

        const { name, category, quantity, price, availableUntil } = req.body;

        const updated = await Produce.findByIdAndUpdate(
            req.params.id,
            { name, category, quantity, price, availableUntil },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Produce not found" });
        }

        res.status(200).json({
            message: "Produce updated successfully",
            produce: withStatus(updated)
        });

    } catch (error) {

        console.log("UPDATE PRODUCE ERROR:", error);

        res.status(500).json({
            message: "Failed to update produce",
            error: error.message
        });

    }

});


// =====================================
// DELETE PRODUCE
// =====================================

router.delete("/:id", async (req, res) => {

    try {

        const deleted = await Produce.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Produce not found" });
        }

        res.status(200).json({ message: "Produce deleted successfully" });

    } catch (error) {

        console.log("DELETE PRODUCE ERROR:", error);

        res.status(500).json({
            message: "Failed to delete produce",
            error: error.message
        });

    }

});


module.exports = router;
