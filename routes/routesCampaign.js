const express = require('express');
const CampaignService = require('../services/campaignService');


function routesCampaignApi(app) {
    const router = express.Router();
    app.use('/campaigns', router);

    const campaignService = new CampaignService();

    router.get('/getCampaigns', async function(req, res, next) {
        //console.log(" req.query: " + JSON.stringify(req.body.query));
        try {
            const campaigns = await campaignService.getCampaigns(req.body.query);

            res.status(200).json({
                success: true,
                total: campaigns.length,
                campaigns: campaigns,
                message: 'query clients'
            });
        } catch (err) {
            res.status(501).json({
                total: 0,
                success: false,
                message: 'error'
            });
            next(err);
        }
    });




    router.post('/createCampaign', async function(req, res, next) {
        const { body: campaign } = req;
        try {
            const campaignId = await campaignService.createCampaign({ campaign });

            res.status(201).json({
                campaignId: campaignId,
                success: true,
                message: 'campaign created'
            });
        } catch (err) {
            res.status(501).json({
                success: false,
                message: 'error'
            });
            next(err);
        }
    });





}


module.exports = routesCampaignApi;