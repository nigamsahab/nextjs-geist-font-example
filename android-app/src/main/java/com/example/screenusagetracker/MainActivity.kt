package com.example.screenusagetracker

import android.app.AppOpsManager
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class MainActivity : AppCompatActivity() {

    private lateinit var usageStatsManager: UsageStatsManager
    private lateinit var textView: TextView
    private lateinit var requestPermissionButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        textView = findViewById(R.id.textView)
        requestPermissionButton = findViewById(R.id.requestPermissionButton)

        requestPermissionButton.setOnClickListener {
            startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        }

        if (!hasUsageStatsPermission()) {
            textView.text = "Permission not granted. Please grant usage access."
        } else {
            displayScreenTime()
        }
    }

    private fun hasUsageStatsPermission(): Boolean {
        val appOps = getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun displayScreenTime() {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - 1000 * 3600 * 24 // last 24 hours

        val usageStatsList: List<UsageStats> = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime
        )

        var totalTime = 0L
        for (usageStats in usageStatsList) {
            totalTime += usageStats.totalTimeInForeground
        }

        val totalMinutes = totalTime / 1000 / 60
        val hours = totalMinutes / 60
        val minutes = totalMinutes % 60

        textView.text = "Screen time in last 24 hours: ${hours}h ${minutes}m"
    }
}
