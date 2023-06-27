const { product } = require("../../models");
const joi = require("joi");

exports.AddProduct = async (req, res) => {
  try {
    const body = req.body;

    // const schema = joi.object({
    //   sku_code: joi.string().min(9).required(),
    //   sku_name: joi.string().min(5).required(),
    //   sku_image: joi.string().min(5).required(),
    //   amount: joi.number().required(),
    // });

    // const { error } = schema.validate(body);

    // if (error) {
    //   return res.status(400).send({
    //     message: error.details[0].message,
    //   });
    // }

    let productData = await product.create({
      sku_code: body.sku_code,
      sku_name: body.sku_name,
      sku_image: req.file.path,
      amount: body.amount,
    });

    return res.status(200).json({
      message: "success to add product",
      data: productData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Ïnternal server error!",
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const data = await product.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    return res.status(200).json({
      message: "OK",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.getProductBySkuCode = async (req, res) => {
  try {
    const sku_code = req.params.sku_code;

    const findProduct = await product.findOne({
      where: {
        sku_code: sku_code,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    return res.status(200).json({
      message: "OK",
      data: findProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.addStock = async (req, res) => {
  try {
    const sku_code = req.params.sku_code;
    const body = req.body;
    const findProduct = await product.findOne({
      where: {
        sku_code: sku_code,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const stockAdded = findProduct.amount + body.amount;

    const data = await findProduct.update(
      { amount: stockAdded },
      {
        where: {
          sku_code: sku_code,
        },
      }
    );

    return res.status(200).json({
      message: "OK. Stock Added",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};

exports.deductStock = async (req, res) => {
  try {
    const sku_code = req.params.sku_code;
    const body = req.body;
    const findProduct = await product.findOne({
      where: {
        sku_code: sku_code,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (body.amount > findProduct.amount) {
      return res.status(400).send({
        message: "Requested amount to be deducted is higher than current stock",
      });
    } else {
      const stockDeducted = findProduct.amount - body.amount;

      const data = await findProduct.update(
        { amount: stockDeducted },
        {
          where: {
            sku_code: sku_code,
          },
        }
      );

      return res.status(200).json({
        message: "OK. Stock Deducted",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};
